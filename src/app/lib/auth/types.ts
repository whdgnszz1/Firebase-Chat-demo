import { IUserPayload } from "@/shared/interfaces/user";

export interface SignupDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestDto {
  idToken: string;
}

export interface LoginResponseDto extends IUserPayload {}
