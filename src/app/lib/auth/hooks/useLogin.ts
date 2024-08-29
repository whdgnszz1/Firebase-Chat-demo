import { useMutation } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { LoginRequestDto, LoginResponseDto, loginApi } from "..";

export const useLogin = () => {
  return useMutation<LoginResponseDto, ApiError, LoginRequestDto>({
    mutationFn: loginApi,
  });
};
