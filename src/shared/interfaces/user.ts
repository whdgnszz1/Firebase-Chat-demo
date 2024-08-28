import type { JWTPayload } from "jose";

/**
 * 사용자 토큰 정보
 */
export interface IUserPayload extends JWTPayload {
  token_type: "access" | "refresh";
  user: {
    name: string;
    email: string;
  };
}
