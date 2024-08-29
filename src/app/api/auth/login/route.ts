import { NextResponse } from "next/server";
import { adminAuth, db } from "@/app/config/firebase-admin";
import { getErrorMessage } from "@/util/api/error";
import { ILegacyApiJson1 } from "@/shared";
import { LoginResponseDto } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json<ILegacyApiJson1<null>>(
        {
          data: null,
          resultCode: "400",
          statusCode: 400,
          resultMessage: "ID 토큰이 제공되지 않았습니다.",
          detailMessage: null,
        },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json<ILegacyApiJson1<null>>(
        {
          data: null,
          resultCode: "404",
          statusCode: 404,
          resultMessage: "사용자 데이터가 존재하지 않습니다.",
          detailMessage: null,
        },
        { status: 404 }
      );
    }

    const responsePayload: LoginResponseDto = {
      token_type: "access",
      user: {
        email: user.email || "",
        name: userData.name || "",
      },
    };

    return NextResponse.json<ILegacyApiJson1<LoginResponseDto>>({
      data: responsePayload,
      resultCode: "200",
      statusCode: 200,
      resultMessage: "로그인 성공",
      detailMessage: null,
    });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("로그인 실패:", errorMessage);

    return NextResponse.json<ILegacyApiJson1<null>>(
      {
        data: null,
        resultCode: "401",
        statusCode: 401,
        resultMessage: "로그인 실패",
        detailMessage: errorMessage,
      },
      { status: 401 }
    );
  }
}
