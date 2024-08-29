import { NextResponse } from "next/server";
import { adminAuth, db } from "@/app/config/firebase-admin";
import { getErrorMessage } from "@/util/api/error";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      throw new Error("ID 토큰이 제공되지 않았습니다.");
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      throw new Error("사용자 데이터가 존재하지 않습니다.");
    }

    return NextResponse.json({
      message: "로그인 성공",
      user: {
        email: user.email,
        name: userData.name || "",
      },
    });
  } catch (error: unknown) {
    console.error("로그인 실패:", getErrorMessage(error));
    return NextResponse.json(
      { message: "로그인 실패", error: getErrorMessage(error) },
      { status: 401 }
    );
  }
}
