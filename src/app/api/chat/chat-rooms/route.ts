import { NextResponse } from "next/server";
import { db } from "@/app/config/firebase-admin";
import { getErrorMessage } from "@/util/api/error";
import { ILegacyApiJson1 } from "@/shared";
import { ChatRoom } from "@/app/lib/chat";

export async function GET() {
  try {
    const chatRoomsSnapshot = await db.collection("chatRooms").get();
    const chatRooms: ChatRoom[] = chatRoomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
    }));

    return NextResponse.json<ILegacyApiJson1<ChatRoom[]>>({
      data: chatRooms,
      resultCode: "200",
      statusCode: 200,
      resultMessage: "채팅방 목록을 성공적으로 가져왔습니다.",
      detailMessage: null,
    });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("채팅방 목록 가져오기 실패:", errorMessage);

    return NextResponse.json<ILegacyApiJson1<null>>(
      {
        data: null,
        resultCode: "500",
        statusCode: 500,
        resultMessage: "채팅방 목록을 가져오는 데 실패했습니다.",
        detailMessage: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { chatRoomName } = await request.json();
    const userEmail = request.headers.get("X-User-Email");

    if (!chatRoomName || !userEmail) {
      return NextResponse.json<ILegacyApiJson1<null>>(
        {
          data: null,
          resultCode: "400",
          statusCode: 400,
          resultMessage: "채팅방 이름과 유저 이메일이 필요합니다.",
          detailMessage: null,
        },
        { status: 400 }
      );
    }

    await db.collection("chatRooms").add({
      name: chatRoomName,
      createdBy: userEmail,
      createdAt: new Date(),
    });

    return NextResponse.json<ILegacyApiJson1<null>>(
      {
        data: null,
        resultCode: "201",
        statusCode: 201,
        resultMessage: "채팅방이 성공적으로 생성되었습니다.",
        detailMessage: null,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("채팅방 생성 실패:", errorMessage);

    return NextResponse.json<ILegacyApiJson1<null>>(
      {
        data: null,
        resultCode: "500",
        statusCode: 500,
        resultMessage: "채팅방 생성에 실패했습니다.",
        detailMessage: errorMessage,
      },
      { status: 500 }
    );
  }
}
