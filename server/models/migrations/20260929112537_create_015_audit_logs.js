/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('audit_logs', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('vault_id')
      .references('id')
      .inTable('vaults')
      .onDelete('CASCADE');

    table
      .uuid('actor_user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('action', 100).notNullable();

    table.specificType('ip_address', 'inet');
    table.text('user_agent');

    table.string('request_id', 100);

    table.jsonb('metadata');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('audit_logs');
};