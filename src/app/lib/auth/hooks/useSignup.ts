import { ILegacyApiJson1 } from "@/shared";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { SignupDto, signUpApi } from "..";

export const useSignUp = () => {
  return useMutation<ILegacyApiJson1<any>, ApiError, SignupDto>({
    mutationFn: signUpApi,
  });
};
