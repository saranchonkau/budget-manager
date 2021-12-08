export interface UserPersistence {
  readonly id: string;
  readonly email: string;
  readonly password_hash: string;
  readonly name: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;
}
