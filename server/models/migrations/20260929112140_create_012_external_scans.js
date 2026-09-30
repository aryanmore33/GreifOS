/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('external_scan_jobs', (table) => {
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
      .string('provider', 50)
      .notNullable()
      .checkIn([
        'IEPF',
        'IRDAI',
        'RBI',
        'other'
      ]);

    table
      .string('status', 30)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'running',
        'completed',
        'failed'
      ]);

    table.integer('attempt_count')
      .notNullable()
      .defaultTo(0);

    table.text('error_message');

    table.timestamp('started_at', { useTz: true });
    table.timestamp('completed_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('external_scan_results', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('scan_job_id')
      .notNullable()
      .references('id')
      .inTable('external_scan_jobs')
      .onDelete('CASCADE');

    table.boolean('result_found')
      .notNullable()
      .defaultTo(false);

    table.decimal('amount_found', 15, 2);

    table.string('currency', 3)
      .notNullable()
      .defaultTo('INR');

    table.text('result_summary');
    table.text('claim_url');

    table.jsonb('result_data');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('external_scan_results');
  await knex.schema.dropTableIfExists('external_scan_jobs');
};