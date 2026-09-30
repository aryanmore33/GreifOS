/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('generated_documents', (table) => {
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
      .uuid('checklist_item_id')
      .references('id')
      .inTable('checklist_items')
      .onDelete('SET NULL');

    table
      .string('document_type', 50)
      .notNullable()
      .checkIn([
        'claim_letter',
        'bank_letter',
        'insurance_letter',
        'cancellation_letter',
        'request_letter',
        'other'
      ]);

    table.string('institution_name', 150);

    table.text('content').notNullable();

    table.string('model_provider', 50);
    table.string('model_used', 100);

    table.integer('prompt_tokens');
    table.integer('completion_tokens');

    table.text('pdf_storage_key');

    table
      .string('status', 30)
      .notNullable()
      .defaultTo('generated')
      .checkIn([
        'generated',
        'downloaded',
        'deleted'
      ]);

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('generated_documents');
};