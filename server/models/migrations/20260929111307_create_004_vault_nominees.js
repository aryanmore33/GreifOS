/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('vault_nominees', (table) => {
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

    /*
     * NULL until nominee creates/registers a GriefOS account.
     */
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    /*
     * NAME
     *
     * Encrypted using OWNER's derived encryption key.
     */
    table.text('name_ciphertext').notNullable();
    table.text('name_iv').notNullable();
    table.text('name_auth_tag').notNullable();

    /*
     * MOBILE
     *
     * Encrypted + HMAC lookup.
     */
    table.text('phone_ciphertext').notNullable();
    table.text('phone_iv').notNullable();
    table.text('phone_auth_tag').notNullable();
    table.text('phone_lookup_hmac').notNullable();

    /*
     * RELATIONSHIP
     *
     * Encrypted because nominee information belongs
     * to the owner's protected vault.
     */
    table.text('relationship_ciphertext').notNullable();
    table.text('relationship_iv').notNullable();
    table.text('relationship_auth_tag').notNullable();

    /*
     * IDENTITY IDENTIFIER
     *
     * For our college project this can represent Aadhaar.
     *
     * We store ONLY HMAC for lookup.
     * No plaintext Aadhaar is stored.
     */
    table
      .string('identity_type', 30)
      .notNullable()
      .defaultTo('aadhaar');

    table.text('identity_lookup_hmac').notNullable();

    /*
     * Nominee lifecycle.
     */
    table
      .string('status', 30)
      .notNullable()
      .defaultTo('invited')
      .checkIn([
        'invited',
        'registered',
        'verified',
        'revoked'
      ]);

    /*
     * Invitation token is also stored only as a hash.
     */
    table.text('invitation_token_hash');
    table.timestamp('invitation_expires_at', { useTz: true });

    table.timestamp('verified_at', { useTz: true });
    table.timestamp('revoked_at', { useTz: true });

    /*
     * Important when encryption keys are rotated.
     */
    table
      .integer('encryption_key_version')
      .notNullable()
      .defaultTo(1);

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
  await knex.schema.dropTableIfExists('vault_nominees');
};