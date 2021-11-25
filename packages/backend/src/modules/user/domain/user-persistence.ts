export interface UserPersistence {
  readonly id: string;
  readonly email: string;
  readonly password_hash: string;
  readonly name: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string;
}
