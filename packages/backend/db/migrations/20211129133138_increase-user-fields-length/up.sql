alter table "user"
    alter column email type varchar(60),
    alter column password_hash type char(145);