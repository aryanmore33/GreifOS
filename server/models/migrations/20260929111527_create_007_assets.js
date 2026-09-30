/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('assets', (table) => {
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
      .uuid('owner_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .string('asset_type', 50)
      .notNullable()
      .checkIn([
        'bank_account',
        'insurance_policy',
        'investment',
        'subscription',
        'property',
        'vehicle',
        'locker',
        'pension',
        'provident_fund',
        'digital_asset',
        'other'
      ]);

    table.string('institution_name', 150).notNullable();
    table.string('label', 200);

    table
      .string('detected_via', 30)
      .checkIn([
        'sms',
        'email',
        'manual',
        'ocr',
        'import'
      ]);

    table.boolean('is_confirmed')
      .notNullable()
      .defaultTo(false);

    table.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    table.text('notes');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('deleted_at', { useTz: true });
  });

  await knex.schema.createTable('subscriptions', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('asset_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('assets')
      .onDelete('CASCADE');

    table.string('merchant_name', 150).notNullable();

    table.decimal('amount', 12, 2);
    table.string('currency', 3).notNullable().defaultTo('INR');

    table
      .string('frequency', 20)
      .checkIn([
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'annually',
        'unknown'
      ]);

    table.date('last_charge_date');
    table.date('next_charge_date');

    table.text('cancellation_steps');

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
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('assets');
};