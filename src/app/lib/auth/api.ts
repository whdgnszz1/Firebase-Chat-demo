import { HttpMethod } from "@/shared";
import { customFetch } from "@/util/api";
import { LoginRequestDto, LoginResponseDto, SignupDto } from ".";

export async function signUpApi(signUpDto: SignupDto): Promise<any> {
  return await customFetch<any>("/api/auth/signup", {
    method: HttpMethod.POST,
    body: JSON.stringify(signUpDto),
  });
}

export async function loginApi(
  loginDto: LoginRequestDto
): Promise<LoginResponseDto> {
  return await customFetch<LoginResponseDto>("/api/auth/login", {
    method: HttpMethod.POST,
    body: JSON.stringify(loginDto),
  });
}
