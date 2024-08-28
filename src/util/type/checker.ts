import type { PureObject } from "@/shared/interfaces/data-type";

type IsPureObject = (data: unknown) => data is PureObject;

export const isPureObject: IsPureObject = (data): data is PureObject => {
  const isNotNull = data !== null;
  const isNotArray = !Array.isArray(data);
  const isNotFunction = !(data instanceof Function);
  const isObjectType = typeof data === "object";

  const isObject = isNotNull && isNotArray && isNotFunction && isObjectType;

  return isObject;
};

export const isString = (data: unknown): data is string => {
  return typeof data === "string";
};

export const isEmpty = (data: unknown): boolean => {
  if (isString(data)) {
    return !(data as string).length;
  }
  if (isPureObject(data)) {
    return !Object.keys(data).length;
  }
  if (Array.isArray(data)) {
    return !data.length;
  }
  return false;
};
