/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('documents', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('vault_id')
      .notNullable()
      .references('id')
      .inTable('vaults')
      .onDelete('CASCADE');

    table
      .uuid('uploaded_by_user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table
      .string('document_type', 50)
      .notNullable()
      .checkIn([
        'death_certificate',
        'identity_document',
        'bank_document',
        'insurance_document',
        'investment_document',
        'property_document',
        'vehicle_document',
        'legal_document',
        'other'
      ]);

    table.string('original_filename', 255).notNullable();
    table.string('mime_type', 100).notNullable();
    table.bigInteger('file_size_bytes').notNullable();

    /*
     * Private S3/object-storage key.
     * NOT a public URL.
     */
    table.text('storage_key').notNullable();

    table
      .string('storage_provider', 30)
      .notNullable()
      .defaultTo('s3');

    /*
     * Detect duplicate files / integrity.
     */
    table.text('sha256_hash').notNullable();

    table
      .string('status', 30)
      .notNullable()
      .defaultTo('uploaded')
      .checkIn([
        'uploaded',
        'processing',
        'processed',
        'verified',
        'rejected',
        'deleted'
      ]);

    table.timestamp('processed_at', { useTz: true });
    table.timestamp('verified_at', { useTz: true });

    table.jsonb('metadata');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('deleted_at', { useTz: true });
  });

  /*
   * OCR result specifically for death certificates.
   */
  await knex.schema.createTable('death_certificate_details', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('document_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('documents')
      .onDelete('CASCADE');

    table.string('deceased_name', 200);
    table.date('date_of_birth');
    table.date('date_of_death');

    table.string('registration_number', 150);
    table.date('registration_date');

    table.string('place_of_death', 250);
    table.string('issuing_authority', 250);

    table.string('father_name', 200);
    table.string('mother_name', 200);
    table.string('spouse_name', 200);

    /*
     * Raw OCR result.
     *
     * Access should be restricted.
     */
    table.text('ocr_text');

    table.decimal('ocr_confidence', 5, 2);

    /*
     * Flexible field-level OCR output.
     */
    table.jsonb('ocr_fields');

    table.string('ocr_engine', 100);
    table.string('ocr_engine_version', 100);

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('death_certificate_details');
  await knex.schema.dropTableIfExists('documents');
};