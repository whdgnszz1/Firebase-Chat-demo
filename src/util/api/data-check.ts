import type { ILegacyApiJson1 } from "@/shared/interfaces/api";
import type { PureObject } from "@/shared/interfaces/data-type";

import { isPureObject } from "../type";
import { getErrorMessage } from "./error";

export const successResultCodeList = [
  "000000",
  "s200",
  "200",
  "OK",
  "S200",
  "201",
  null,
];

type pureObjectWithResultCode<T> = ILegacyApiJson1<T>;

/**
 * 1. 불필요한 객체 중첩을 제거하고 data를 반환
 * ex) { resultCode: '000000', data: { a: 'b' } } => { a: 'b' }
 * 2. 객체가 아닌 경우 그대로 반환
 * ex) ['a', 'b', 'c'] => ['a', 'b', 'c']
 */
export const parseApiData = <S>(
  rawData: S | { resultCode?: string; data?: S }
) => {
  if (isPureObject(rawData)) {
    if ("resultCode" in (rawData as PureObject)) {
      return resultCodeChecker<S>(rawData as pureObjectWithResultCode<S>);
    }
    return rawData as S;
  }

  return rawData as S;
};

/**
 * response가 있지만 resultCode가 성공이 아닐 경우 Error를 반환
 * 성공일 경우 불필요한 중첩을 제거하고 data를 반환
 * ex) { resultCode: '000000', data: { a: 'b' } } => { a: 'b' }
 */
export const resultCodeChecker = <S>(rawData: pureObjectWithResultCode<S>) => {
  if (successResultCodeList.includes(rawData.resultCode)) {
    if (rawData.data) return rawData.data;

    return rawData as S;
  }

  throw getErrorMessage(
    `Unhandled response result code: ${rawData.resultCode}`
  );
};
