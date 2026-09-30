/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('otp_challenges', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    /*
     * Used to find the user without plaintext phone lookup.
     */
    table.text('phone_lookup_hmac').notNullable();

    table
      .string('purpose', 40)
      .notNullable()
      .checkIn([
        'owner_login',
        'phone_verification',
        'nominee_login',
        'vault_access'
      ]);

    /*
     * Never store raw OTP.
     */
    table.text('otp_hash').notNullable();

    table.integer('attempts')
      .notNullable()
      .defaultTo(0);

    table.integer('max_attempts')
      .notNullable()
      .defaultTo(5);

    table.boolean('is_used')
      .notNullable()
      .defaultTo(false);

    table.timestamp('expires_at', { useTz: true })
      .notNullable();

    table.timestamp('used_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('otp_challenges');
};