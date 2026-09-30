/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    /*
     * NAME
     */
    table.text('name_ciphertext').notNullable();
    table.text('name_iv').notNullable();
    table.text('name_auth_tag').notNullable();

    /*
     * PHONE
     *
     * Ciphertext is for confidentiality.
     * HMAC is for lookup without decrypting.
     */
    table.text('phone_ciphertext').notNullable();
    table.text('phone_iv').notNullable();
    table.text('phone_auth_tag').notNullable();
    table.text('phone_lookup_hmac').notNullable().unique();

    /*
     * EMAIL
     */
    table.text('email_ciphertext');
    table.text('email_iv');
    table.text('email_auth_tag');
    table.text('email_lookup_hmac').unique();

    /*
     * DATE OF BIRTH
     */
    table.text('dob_ciphertext');
    table.text('dob_iv');
    table.text('dob_auth_tag');

    /*
     * Password is ALWAYS one-way hashed.
     */
    table.text('password_hash').notNullable();

    table
      .string('role', 20)
      .notNullable()
      .defaultTo('owner')
      .checkIn([
        'owner',
        'nominee'
      ]);

    table.boolean('is_phone_verified')
      .notNullable()
      .defaultTo(false);

    table.boolean('is_identity_verified')
      .notNullable()
      .defaultTo(false);

    table.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    /*
     * Used when cryptographic keys are rotated.
     */
    table.integer('encryption_key_version')
      .notNullable()
      .defaultTo(1);

    table.timestamp('last_login_at', { useTz: true });

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
  await knex.schema.dropTableIfExists('users');
};