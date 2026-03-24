const pool = require('../config/db');

// Initialize connection pool

const query = ` 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'nominee')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vaults (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    encrypted_data TEXT NOT NULL,
    encryption_iv TEXT NOT NULL,
    pbkdf2_salt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id)
);

CREATE TABLE nominees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nominee_name VARCHAR(100) NOT NULL,
    nominee_phone VARCHAR(15) NOT NULL,
    relationship VARCHAR(50) CHECK (relationship IN (
        'spouse','child','parent','sibling','friend','other'
    )),
    access_token_hash TEXT,
    token_generated_at TIMESTAMPTZ,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vault_id)
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN (
        'bank_account',
        'insurance_policy',
        'investment',
        'subscription',
        'property',
        'vehicle',
        'locker',
        'other'
    )),
    institution_name VARCHAR(150) NOT NULL,
    label VARCHAR(200),
    detected_via VARCHAR(20) CHECK (detected_via IN ('sms', 'manual')),
    is_confirmed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    merchant_name VARCHAR(150) NOT NULL,
    amount NUMERIC(10, 2),
    currency VARCHAR(5) DEFAULT 'INR',
    frequency VARCHAR(20) CHECK (frequency IN (
        'daily','weekly','monthly','quarterly','annually','unknown'
    )),
    last_charge_date DATE,
    cancellation_steps TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE death_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    uploaded_by_phone VARCHAR(15) NOT NULL,
    file_url TEXT NOT NULL,
    ocr_extracted_name VARCHAR(200),
    ocr_extracted_dod DATE,
    ocr_confidence_score NUMERIC(5, 2),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
        verification_status IN ('pending','verified','rejected')
    ),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL,
    otp_hash TEXT NOT NULL,
    purpose VARCHAR(30) CHECK (purpose IN (
        'nominee_unlock','owner_login','phone_verify'
    )),
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    state VARCHAR(50),
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0
);

CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    task_title VARCHAR(250) NOT NULL,
    task_description TEXT,
    institution_name VARCHAR(150),
    urgency VARCHAR(20) CHECK (urgency IN ('day_1_7','day_8_30','month_1_6')),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE generated_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE SET NULL,
    institution_name VARCHAR(150) NOT NULL,
    letter_type VARCHAR(100),
    letter_content TEXT NOT NULL,
    model_used VARCHAR(100),
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE unclaimed_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    portal VARCHAR(20) NOT NULL CHECK (portal IN ('IEPF','IRDAI','RBI')),
    scan_status VARCHAR(20) DEFAULT 'pending' CHECK (
        scan_status IN ('pending','completed','failed')
    ),
    result_found BOOLEAN DEFAULT FALSE,
    amount_found NUMERIC(12, 2),
    result_summary TEXT,
    claim_url TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    actor_phone VARCHAR(15),
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user','assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assets_vault_id ON assets(vault_id);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_checklist_items_urgency ON checklist_items(urgency);
CREATE INDEX idx_checklist_vault ON checklists(vault_id);
CREATE INDEX idx_audit_vault_id ON audit_logs(vault_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_otp_phone ON otp_verifications(phone);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
CREATE INDEX idx_chat_vault_id ON chat_messages(vault_id);
CREATE INDEX idx_unclaimed_vault_id ON unclaimed_scans(vault_id);
CREATE INDEX idx_letters_vault_id ON generated_letters(vault_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_vaults_updated
BEFORE UPDATE ON vaults
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_nominees_updated
BEFORE UPDATE ON nominees
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_assets_updated
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`;

// Function to initialize the database schema
async function initializeDB() {
  try {
    const result = await pool.query(query);
    console.log(`Successfully Completed`);
  } catch (error) {
    console.log(error);
  }
}
initializeDB();
