alter table "user"
    alter column email type varchar(30),
    alter column password_hash type char(60);