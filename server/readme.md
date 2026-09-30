                         MASTER KEY
                             │
                        NEVER IN DB
                             │
                    ┌────────┴────────┐
                    │      HKDF       │
                    └────────┬────────┘
                             │
                      Owner UUID
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          VAULT KEY      NOMINEE KEY      CHAT KEY
              │              │              │
              ▼              ▼              ▼
         Vault data     Nominee data    Chat messages
              │              │
              │              ├── Name → AES-GCM
              │              ├── Phone → AES-GCM
              │              ├── Relation → AES-GCM
              │              └── Aadhaar → HMAC
              │
              └── AES-256-GCM


models/
│
├── BaseModel.js
│
├── UserModel.js
├── VaultModel.js
├── VaultNomineeModel.js
│
├── DocumentModel.js
├── DeathCertificateDetailsModel.js
├── DeathVerificationCaseModel.js
├── VerificationEvidenceModel.js
│
├── AssetModel.js
├── SubscriptionModel.js
├── ChecklistModel.js
├── ChecklistItemModel.js
│
├── VaultAccessRequestModel.js
├── AccessRequestVoteModel.js
├── VaultAccessGrantModel.js
│
├── OtpChallengeModel.js
├── NotificationModel.js
├── ExternalScanJobModel.js
├── ExternalScanResultModel.js
├── GeneratedDocumentModel.js
├── ChatMessageModel.js
└── AuditLogModel.js