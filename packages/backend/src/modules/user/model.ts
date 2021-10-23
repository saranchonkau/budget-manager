// id smallint NOT NULL GENERATED ALWAYS AS IDENTITY,
//     email character varying(30) NOT NULL,
//     password_hash character(60) NOT NULL,
//     name character varying(30) NOT NULL,
//     created_at timestamp with time zone NOT NULL,
//     updated_at timestamp with time zone NOT NULL,
//     deleted_at timestamp with time zone NOT NULL,

export interface UserDBPayload {
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface UserModel extends UserDBPayload {
  id: number;
}
