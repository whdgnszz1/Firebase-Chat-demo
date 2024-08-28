/* eslint-disable no-undef */
import {
  AuthCookie,
  HttpContentType,
  HttpHeader,
  HttpMethod,
  HttpMethodType,
} from "@/shared/constants";
import type { FnCustomFetch } from "@/shared/interfaces/api";

import { isClient } from "../envs";
import { parseApiData } from "./data-check";
import { getErrorMessage } from "./error";

const { CONTENT_TYPE } = HttpHeader;

export type CustomFetchOptions = RequestInit & {
  method?: HttpMethodType;
  /** header Contetn-type 사용 여부 */
  isNotContentType?: boolean;
  /** 파일 다운로드 여부 */
  isFileDown?: boolean;
};

export interface IApiFetchOptions {
  /** request parameter */
  params?: Record<string, unknown>;
  /** fetch Options */
  fetchOption?: CustomFetchOptions;
}

/**
 * 하위 로직을 전부 포함한 fetch
 * 특별한 경우가 아니라면 기본적으로 사용
 */
export const customFetch = async <T>(
  url: string,
  option?: CustomFetchOptions
) => {
  // if (isMockDataUrl(url)) {
  //   return returnMockData<S>(url, option)
  // }

  const response = await baseFetch<T>(url, option);
  if (option?.isFileDown) return response;

  const data = parseApiData<T>(response);

  return data;
};

/**
 * credentials, accessToken을 추가한 fetch
 * credentials, accessToken: 로그인 상태를 유지하기 위해 사용
 */
export const baseFetch = async <S>(
  url: string,
  option: CustomFetchOptions = { method: HttpMethod.GET }
) => {
  const headers = new Headers(option.headers);
  if (!option?.isNotContentType && !(CONTENT_TYPE in headers)) {
    headers.set(CONTENT_TYPE, HttpContentType.JSON);
  }
  let accessToken;
  if (isClient) {
    const { default: clientCookies } = await import("js-cookie");
    accessToken = clientCookies.get(AuthCookie.ACCESS_TOKEN);
  } else {
    const { cookies } = await import("next/headers");
    accessToken = cookies().get(AuthCookie.ACCESS_TOKEN)?.value;
  }
  if (accessToken) {
    headers.set(HttpHeader.AUTHORIZATION, accessToken);
  }

  const withAuthOption = {
    ...option,
    headers,
  } as const;

  const response = await fetchInterface<S>(url, withAuthOption);

  return response;
};

/**
 * 기본 fetch
 * 최하위 try-catch하기 위해 사용
 */
export const fetchInterface: FnCustomFetch = async (url, option) => {
  try {
    const response = await fetch(url, option);
    if (!response.ok) {
      const responseText = await response.text();
      const errorMessage = responseText + "\n" + "Response status isn't OK.";
      throw new Error(errorMessage);
    }

    if (response.headers.get(CONTENT_TYPE)?.includes(HttpContentType.JSON)) {
      const data = await response.json();

      return data;
    }

    return response;
  } catch (error) {
    throw getErrorMessage(error);
  }
};
