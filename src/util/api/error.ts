import { isPureObject } from "../type";

interface IErrorWithMessage {
  message: string;
}

type IsErrorWithMessage = (error: unknown) => error is IErrorWithMessage;

const isErrorWithMessage: IsErrorWithMessage = (
  error
): error is IErrorWithMessage => {
  const isObject = isPureObject(error);

  const isMessageString =
    isObject && "message" in error && typeof error.message === "string";

  return isMessageString;
};

type ToErrorWithMessage = (maybeError: unknown) => IErrorWithMessage;

const toErrorWithMessage: ToErrorWithMessage = (error) => {
  if (isErrorWithMessage(error)) return error;

  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error(String(error));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};
