import { QueryParams } from "../typings/common";

export function convertParamsToString(
  params: QueryParams | URLSearchParams = {}
): string {
  let resultSearchParams: URLSearchParams;

  if (params instanceof URLSearchParams) {
    resultSearchParams = params;
  } else {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) =>
      searchParams.append(key, value)
    );

    resultSearchParams = searchParams;
  }

  const queryString = resultSearchParams.toString();
  return queryString ? "?" + queryString : "";
}
