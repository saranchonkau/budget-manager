-- Table: public.user

CREATE TABLE "user"
(
    id smallserial NOT NULL,
    email character varying(30) NOT NULL,
    password_hash character(60) NOT NULL,
    name character varying(30) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_email_key UNIQUE (email)
);