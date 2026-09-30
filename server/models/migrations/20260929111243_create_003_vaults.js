/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('vaults', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('owner_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    /*
     * Main encrypted vault payload.
     */
    table.text('encrypted_data').notNullable();
    table.text('encryption_iv').notNullable();
    table.text('encryption_auth_tag').notNullable();

    table
      .string('encryption_algorithm', 50)
      .notNullable()
      .defaultTo('AES-256-GCM');

    table
      .string('kdf_algorithm', 50)
      .notNullable()
      .defaultTo('HKDF-SHA256');

    /*
     * Version of the key derivation/encryption scheme.
     */
    table
      .integer('encryption_key_version')
      .notNullable()
      .defaultTo(1);

    table.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    table.timestamp('last_scanned_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('deleted_at', { useTz: true });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('vaults');
};