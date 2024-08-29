import { adminAuth, db } from "@/app/config/firebase-admin";
import { getErrorMessage } from "@/util/api/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
    });

    return NextResponse.json({
      message: "회원가입 성공",
    });
  } catch (error: unknown) {
    console.error("회원가입 실패:", getErrorMessage(error));
    return NextResponse.json(
      { message: "회원가입 실패", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
