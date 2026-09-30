/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('checklists', (table) => {
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
      .string('status', 30)
      .notNullable()
      .defaultTo('active')
      .checkIn([
        'draft',
        'active',
        'completed',
        'archived'
      ]);

    table.string('version', 30)
      .notNullable()
      .defaultTo('1.0');

    table.timestamp('generated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('completed_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('checklist_items', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('checklist_id')
      .notNullable()
      .references('id')
      .inTable('checklists')
      .onDelete('CASCADE');

    table
      .uuid('asset_id')
      .references('id')
      .inTable('assets')
      .onDelete('SET NULL');

    table.string('task_title', 250).notNullable();
    table.text('task_description');

    table.string('institution_name', 150);

    table
      .string('urgency', 20)
      .notNullable()
      .checkIn([
        'day_1_7',
        'day_8_30',
        'month_1_6',
        'later'
      ]);

    table
      .string('status', 30)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'in_progress',
        'completed',
        'skipped'
      ]);

    table.timestamp('due_date', { useTz: true });
    table.timestamp('completed_at', { useTz: true });

    table.integer('sort_order')
      .notNullable()
      .defaultTo(0);

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
  await knex.schema.dropTableIfExists('checklist_items');
  await knex.schema.dropTableIfExists('checklists');
};