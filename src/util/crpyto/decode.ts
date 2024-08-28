import { Base64 } from "js-base64";

/**
 * JWT Payload 파싱
 */
export function decodeJWT<T>(token: string): T | null {
  try {
    const tokenSplitted = token.split(".");
    if (tokenSplitted.length < 2) {
      throw new Error("Invalid JWT token");
    }

    const payload = JSON.parse(Base64.decode(tokenSplitted[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}
export function b64DecodeUnicode(str: string) {
  try {
    return Base64.decode(str);
  } catch (error) {
    console.error("Failed to decode base64 string:", error);
    return "";
  }
}

export const safeAtob = (base64String: string) => {
  try {
    // Clean and decode the base64 string
    const cleanString = base64String
      .replace(/[^A-Za-z0-9+/=]/g, "") // Remove any invalid characters
      .replace(/-/g, "+") // Handle URL-safe base64 encoding
      .replace(/_/g, "/"); // Handle URL-safe base64 encoding

    // Decode the base64 string
    return atob(cleanString);
  } catch (e) {
    console.error("Error decoding base64 string:", e);
    return null; // or handle the error as needed
  }
};
