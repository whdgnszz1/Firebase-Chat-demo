interface ILegacyApiBase<T = unknown> {
  data: T;
  resultCode: string;
}

export interface ILegacyApiJson1<T> extends ILegacyApiBase<T> {
  statusCode?: number;
  resultMessage?: string;
  detailMessage?: string | null;
}

export type FnCustomFetch = <T = unknown>(
  url: string,
  option?: RequestInit
) => Promise<T>;
