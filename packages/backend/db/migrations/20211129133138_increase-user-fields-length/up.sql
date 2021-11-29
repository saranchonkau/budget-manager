ALTER TABLE "user"
    ALTER COLUMN email TYPE character varying(60),
    ALTER COLUMN password_hash TYPE character(145);