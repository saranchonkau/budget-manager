export type Option<V = string> = {
  value: V;
  label: string;
};

export type Nullable<T> = T | null;

export type Nullish<T> = T | null | undefined;

export type ConstantMap<C extends string> = Readonly<Record<C, C>>;

export type FetchStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

export interface BaseResourceType {
  data: unknown;
  status: string;
  error: unknown;
  meta: unknown;
}

export interface ResourceType<
  DataType,
  Status extends string = FetchStatus,
  ErrorType = unknown,
  MetaType = unknown
> extends BaseResourceType {
  data: DataType;
  status: Status;
  error: ErrorType;
  meta: MetaType;
}

export interface PaginatedResourceType<
  EntityType,
  Status extends string = FetchStatus,
  ErrorType = unknown
> extends BaseResourceType {
  data: Array<EntityType>;
  status: Status;
  error: ErrorType;
  meta: Nullable<PaginationMeta>;
}

export type QueryParams = { [key: string]: any };

export interface ValidationError {
  code: string;
  message: string;
}

export interface PaginationMeta {
  page: {
    number: number;
    size: number;
    count: number;
  };
  total: number;
}

export type ResponseBody<Data = unknown, M = unknown> = {
  data: Data;
  errors?: Record<string, ValidationError>;
  message?: string;
  meta?: M;
};

export interface DataResponseBody<D> {
  data: D;
}

export interface PaginatedDataResponseBody<D> extends DataResponseBody<D> {
  meta: PaginationMeta;
}

export interface ValidationResponseBody {
  message: string;
  errors?: { [key: string]: ValidationError };
}
