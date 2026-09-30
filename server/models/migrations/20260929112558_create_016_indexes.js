/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  /*
   * USERS
   */
  await knex.raw(`
    CREATE INDEX idx_users_role
    ON users(role)
  `);

  /*
   * VAULTS
   */
  await knex.raw(`
    CREATE INDEX idx_vaults_owner
    ON vaults(owner_id)
  `);

  /*
   * NOMINEES
   */
  await knex.raw(`
    CREATE INDEX idx_nominees_vault
    ON vault_nominees(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_nominees_user
    ON vault_nominees(user_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_nominees_phone_hmac
    ON vault_nominees(phone_lookup_hmac)
  `);

  await knex.raw(`
    CREATE INDEX idx_nominees_identity_hmac
    ON vault_nominees(identity_lookup_hmac)
  `);

  /*
   * DOCUMENTS
   */
  await knex.raw(`
    CREATE INDEX idx_documents_vault
    ON documents(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_documents_type
    ON documents(document_type)
  `);

  await knex.raw(`
    CREATE INDEX idx_documents_hash
    ON documents(sha256_hash)
  `);

  /*
   * DEATH VERIFICATION
   */
  await knex.raw(`
    CREATE INDEX idx_verification_vault
    ON death_verification_cases(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_verification_status
    ON death_verification_cases(status)
  `);

  await knex.raw(`
    CREATE INDEX idx_verification_evidence_case
    ON verification_evidence(verification_case_id)
  `);

  /*
   * ASSETS
   */
  await knex.raw(`
    CREATE INDEX idx_assets_vault
    ON assets(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_assets_type
    ON assets(asset_type)
  `);

  /*
   * CHECKLISTS
   */
  await knex.raw(`
    CREATE INDEX idx_checklists_vault
    ON checklists(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_checklist_items_checklist
    ON checklist_items(checklist_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_checklist_items_status
    ON checklist_items(status)
  `);

  await knex.raw(`
    CREATE INDEX idx_checklist_items_urgency
    ON checklist_items(urgency)
  `);

  /*
   * ACCESS REQUESTS
   */
  await knex.raw(`
    CREATE INDEX idx_access_requests_vault
    ON vault_access_requests(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_access_requests_nominee
    ON vault_access_requests(requesting_nominee_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_access_requests_status
    ON vault_access_requests(status)
  `);

  /*
   * VOTES
   */
  await knex.raw(`
    CREATE INDEX idx_access_votes_request
    ON access_request_votes(access_request_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_access_votes_nominee
    ON access_request_votes(nominee_id)
  `);

  /*
   * GRANTS
   */
  await knex.raw(`
    CREATE INDEX idx_access_grants_vault
    ON vault_access_grants(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_access_grants_nominee
    ON vault_access_grants(nominee_id)
  `);

  /*
   * OTP
   */
  await knex.raw(`
    CREATE INDEX idx_otp_phone_hmac
    ON otp_challenges(phone_lookup_hmac)
  `);

  await knex.raw(`
    CREATE INDEX idx_otp_expires
    ON otp_challenges(expires_at)
  `);

  /*
   * NOTIFICATIONS
   */
  await knex.raw(`
    CREATE INDEX idx_notifications_user
    ON notifications(user_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_notifications_unread
    ON notifications(user_id, is_read)
    WHERE is_read = FALSE
  `);

  /*
   * EXTERNAL SCANS
   */
  await knex.raw(`
    CREATE INDEX idx_scan_jobs_vault
    ON external_scan_jobs(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_scan_jobs_status
    ON external_scan_jobs(status)
  `);

  /*
   * AUDIT
   */
  await knex.raw(`
    CREATE INDEX idx_audit_vault
    ON audit_logs(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_audit_actor
    ON audit_logs(actor_user_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_audit_created
    ON audit_logs(created_at DESC)
  `);

  /*
   * CHAT
   */
  await knex.raw(`
    CREATE INDEX idx_chat_vault
    ON chat_messages(vault_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_chat_created
    ON chat_messages(created_at DESC)
  `);

  /*
   * GENERATED DOCUMENTS
   */
  await knex.raw(`
    CREATE INDEX idx_generated_documents_vault
    ON generated_documents(vault_id)
  `);

  /*
   * Only ONE active access request at a time for a vault.
   *
   * Once it is denied/expired, a new request can be created.
   */
  await knex.raw(`
    CREATE UNIQUE INDEX uq_active_access_request
    ON vault_access_requests(vault_id)
    WHERE status IN (
      'pending',
      'otp_required',
      'identity_verification',
      'waiting_for_nominees'
    )
  `);

  /*
   * Only ONE active verification case per vault.
   */
  await knex.raw(`
    CREATE UNIQUE INDEX uq_active_verification_case
    ON death_verification_cases(vault_id)
    WHERE status IN (
      'pending',
      'ocr_processing',
      'under_review'
    )
  `);

  /*
   * Only one active grant for a nominee/vault.
   */
  await knex.raw(`
    CREATE UNIQUE INDEX uq_active_vault_access
    ON vault_access_grants(vault_id, nominee_id)
    WHERE is_active = TRUE
      AND revoked_at IS NULL
  `);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  const indexes = [
    'uq_active_vault_access',
    'uq_active_verification_case',
    'uq_active_access_request',

    'idx_generated_documents_vault',

    'idx_chat_created',
    'idx_chat_vault',

    'idx_audit_created',
    'idx_audit_actor',
    'idx_audit_vault',

    'idx_scan_jobs_status',
    'idx_scan_jobs_vault',

    'idx_notifications_unread',
    'idx_notifications_user',

    'idx_otp_expires',
    'idx_otp_phone_hmac',

    'idx_access_grants_nominee',
    'idx_access_grants_vault',

    'idx_access_votes_nominee',
    'idx_access_votes_request',

    'idx_access_requests_status',
    'idx_access_requests_nominee',
    'idx_access_requests_vault',

    'idx_checklist_items_urgency',
    'idx_checklist_items_status',
    'idx_checklist_items_checklist',
    'idx_checklists_vault',

    'idx_assets_type',
    'idx_assets_vault',

    'idx_verification_evidence_case',
    'idx_verification_status',
    'idx_verification_vault',

    'idx_documents_hash',
    'idx_documents_type',
    'idx_documents_vault',

    'idx_nominees_identity_hmac',
    'idx_nominees_phone_hmac',
    'idx_nominees_user',
    'idx_nominees_vault',

    'idx_vaults_owner',
    'idx_users_role'
  ];

  for (const index of indexes) {
    await knex.raw(`DROP INDEX IF EXISTS ${index}`);
  }
};