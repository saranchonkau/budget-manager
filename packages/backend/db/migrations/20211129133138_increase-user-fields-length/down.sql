ALTER TABLE "user"
    ALTER COLUMN email TYPE character varying(30),
    ALTER COLUMN password_hash TYPE character(60);