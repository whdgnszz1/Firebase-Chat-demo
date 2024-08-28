"use server";

import { cookies } from "next/headers";

import { AuthCookie } from "@/shared";
import { b64DecodeUnicode } from "@/util/crpyto";
import { type IUserPayload } from "../interfaces/user";

export async function getUserPayload(): Promise<IUserPayload | null> {
  const payload = cookies().get(AuthCookie.ACCESS_TOKEN)?.value.split(".")[1];
  if (payload == null) {
    return null;
  }
  const user = JSON.parse(b64DecodeUnicode(payload));
  console.log("* user session:", user);

  return user;
}

export async function authorize(): Promise<IUserPayload | null> {
  return await getUserPayload();
}
