/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('death_verification_cases', (table) => {
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
      .uuid('nominee_id')
      .references('id')
      .inTable('vault_nominees')
      .onDelete('SET NULL');

    table
      .uuid('death_certificate_document_id')
      .references('id')
      .inTable('documents')
      .onDelete('SET NULL');

    table
      .string('status', 30)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'ocr_processing',
        'under_review',
        'verified',
        'rejected',
        'expired',
        'cancelled'
      ]);

    table
      .string('verification_level', 40)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'ocr_match',
        'document_verified',
        'externally_verified',
        'manually_verified'
      ]);

    table.text('rejection_reason');

    table.timestamp('submitted_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('verified_at', { useTz: true });
    table.timestamp('expires_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('verification_evidence', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('verification_case_id')
      .notNullable()
      .references('id')
      .inTable('death_verification_cases')
      .onDelete('CASCADE');

    table
      .string('evidence_type', 50)
      .notNullable()
      .checkIn([
        'ocr',
        'qr_code',
        'digital_signature',
        'official_portal',
        'digilocker',
        'manual_review',
        'identity_match'
      ]);

    table
      .string('status', 30)
      .notNullable()
      .checkIn([
        'pending',
        'passed',
        'failed',
        'unavailable',
        'inconclusive'
      ]);

    table.decimal('confidence_score', 5, 2);

    table.jsonb('extracted_data');
    table.jsonb('response_metadata');

    /*
     * Reference returned by external provider.
     *
     * Never put OAuth access tokens here.
     */
    table.string('external_reference', 255);

    table.text('failure_reason');

    table.timestamp('checked_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('verification_evidence');
  await knex.schema.dropTableIfExists('death_verification_cases');
};