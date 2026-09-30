/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  /*
   * A nominee requests access to the vault.
   */
  await knex.schema.createTable('vault_access_requests', (table) => {
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
      .uuid('requesting_nominee_id')
      .notNullable()
      .references('id')
      .inTable('vault_nominees')
      .onDelete('CASCADE');

    table
      .uuid('verification_case_id')
      .references('id')
      .inTable('death_verification_cases')
      .onDelete('SET NULL');

    table
      .string('status', 40)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'otp_required',
        'identity_verification',
        'waiting_for_nominees',
        'approved',
        'denied',
        'expired',
        'revoked'
      ]);

    table.timestamp('voting_started_at', { useTz: true });
    table.timestamp('voting_deadline', { useTz: true });

    table.timestamp('approved_at', { useTz: true });
    table.timestamp('denied_at', { useTz: true });
    table.timestamp('expired_at', { useTz: true });

    table.text('denial_reason');

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  /*
   * Each OTHER nominee gets one vote.
   */
  await knex.schema.createTable('access_request_votes', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('access_request_id')
      .notNullable()
      .references('id')
      .inTable('vault_access_requests')
      .onDelete('CASCADE');

    table
      .uuid('nominee_id')
      .notNullable()
      .references('id')
      .inTable('vault_nominees')
      .onDelete('CASCADE');

    table
      .string('decision', 20)
      .notNullable()
      .defaultTo('pending')
      .checkIn([
        'pending',
        'approved',
        'denied'
      ]);

    table.text('reason');

    table.timestamp('decided_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique([
      'access_request_id',
      'nominee_id'
    ]);
  });

  /*
   * Created only after the access request is approved.
   */
  await knex.schema.createTable('vault_access_grants', (table) => {
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
      .uuid('nominee_id')
      .notNullable()
      .references('id')
      .inTable('vault_nominees')
      .onDelete('CASCADE');

    table
      .uuid('access_request_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('vault_access_requests')
      .onDelete('CASCADE');

    table
      .string('access_level', 30)
      .notNullable()
      .defaultTo('full')
      .checkIn([
        'read_only',
        'full'
      ]);

    table.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    table.timestamp('granted_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('expires_at', { useTz: true });
    table.timestamp('revoked_at', { useTz: true });

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('vault_access_grants');
  await knex.schema.dropTableIfExists('access_request_votes');
  await knex.schema.dropTableIfExists('vault_access_requests');
};