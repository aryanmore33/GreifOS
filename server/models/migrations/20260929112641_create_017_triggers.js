/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  /*
   * --------------------------------------------------
   * UPDATED_AT TRIGGER
   * --------------------------------------------------
   */
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  const updatedTables = [
    'users',
    'vaults',
    'vault_nominees',
    'documents',
    'death_certificate_details',
    'death_verification_cases',
    'assets',
    'subscriptions',
    'checklists',
    'checklist_items',
    'vault_access_requests',
    'external_scan_jobs'
  ];

  for (const table of updatedTables) {
    await knex.raw(`
      CREATE TRIGGER trg_${table}_updated
      BEFORE UPDATE ON ${table}
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
    `);
  }

  /*
   * --------------------------------------------------
   * MAX 5 ACTIVE NOMINEES
   * --------------------------------------------------
   *
   * Advisory transaction lock prevents two concurrent
   * requests from bypassing the five-nominee limit.
   */
  await knex.raw(`
    CREATE OR REPLACE FUNCTION enforce_max_five_nominees()
    RETURNS TRIGGER AS $$
    BEGIN

      PERFORM pg_advisory_xact_lock(
        hashtext(NEW.vault_id::text)
      );

      IF (
        SELECT COUNT(*)
        FROM vault_nominees
        WHERE vault_id = NEW.vault_id
          AND status <> 'revoked'
      ) >= 5 THEN

        RAISE EXCEPTION
          'A vault can have a maximum of 5 active nominees';

      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_max_five_nominees
    BEFORE INSERT ON vault_nominees
    FOR EACH ROW
    EXECUTE FUNCTION enforce_max_five_nominees();
  `);

  /*
   * --------------------------------------------------
   * PREVENT REQUESTING NOMINEE FROM VOTING
   * --------------------------------------------------
   */
  await knex.raw(`
    CREATE OR REPLACE FUNCTION prevent_requester_vote()
    RETURNS TRIGGER AS $$
    DECLARE
      requester UUID;
    BEGIN

      SELECT requesting_nominee_id
      INTO requester
      FROM vault_access_requests
      WHERE id = NEW.access_request_id;

      IF requester = NEW.nominee_id THEN
        RAISE EXCEPTION
          'The nominee requesting access cannot vote on their own request';
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_prevent_requester_vote
    BEFORE INSERT OR UPDATE ON access_request_votes
    FOR EACH ROW
    EXECUTE FUNCTION prevent_requester_vote();
  `);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_prevent_requester_vote
    ON access_request_votes;
  `);

  await knex.raw(`
    DROP FUNCTION IF EXISTS prevent_requester_vote();
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_max_five_nominees
    ON vault_nominees;
  `);

  await knex.raw(`
    DROP FUNCTION IF EXISTS enforce_max_five_nominees();
  `);

  const updatedTables = [
    'users',
    'vaults',
    'vault_nominees',
    'documents',
    'death_certificate_details',
    'death_verification_cases',
    'assets',
    'subscriptions',
    'checklists',
    'checklist_items',
    'vault_access_requests',
    'external_scan_jobs'
  ];

  for (const table of updatedTables) {
    await knex.raw(`
      DROP TRIGGER IF EXISTS trg_${table}_updated
      ON ${table};
    `);
  }

  await knex.raw(`
    DROP FUNCTION IF EXISTS update_updated_at();
  `);
};