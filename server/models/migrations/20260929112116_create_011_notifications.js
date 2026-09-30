/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('notifications', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .uuid('vault_id')
      .references('id')
      .inTable('vaults')
      .onDelete('CASCADE');

    table
      .uuid('access_request_id')
      .references('id')
      .inTable('vault_access_requests')
      .onDelete('CASCADE');

    table
      .string('type', 50)
      .notNullable()
      .checkIn([
        'vault_access_request',
        'access_approved',
        'access_denied',
        'access_expired',
        'verification_required',
        'system'
      ]);

    table.string('title', 200).notNullable();
    table.text('message').notNullable();

    table.boolean('is_read')
      .notNullable()
      .defaultTo(false);

    table.timestamp('read_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('notifications');
};