import { NextResponse } from "next/server";
import { auth, db } from "@/app/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getErrorMessage } from "@/util/api/error";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();

    return NextResponse.json({
      message: "로그인 성공",
      user: {
        email: userCredential.user.email,
        name: userData?.name || "",
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
