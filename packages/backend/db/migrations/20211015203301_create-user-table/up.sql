create table "user"
(
    id            uuid                     not null,
    email         varchar(30)              not null,
    password_hash char(60)                 not null,
    name          varchar(30)              not null,
    created_at    timestamp with time zone not null,
    updated_at    timestamp with time zone not null,
    deleted_at    timestamp with time zone not null,
    constraint user_pkey primary key (id),
    constraint user_email_key unique (email)
);