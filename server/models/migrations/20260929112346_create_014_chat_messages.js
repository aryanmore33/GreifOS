/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('chat_messages', (table) => {
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
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table
      .string('role', 20)
      .notNullable()
      .checkIn([
        'user',
        'assistant',
        'system'
      ]);

    table.text('content_ciphertext').notNullable();
    table.text('content_iv').notNullable();
    table.text('content_auth_tag').notNullable();

    table
  .string('encryption_algorithm', 50)
  .notNullable()
  .defaultTo('AES-256-GCM');

    table
  .integer('encryption_key_version')
  .notNullable()
  .defaultTo(1);

    table.string('model_provider', 50);
    table.string('model_used', 100);

    table.integer('prompt_tokens');
    table.integer('completion_tokens');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('chat_messages');
};