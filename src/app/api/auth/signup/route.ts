import { NextResponse } from "next/server";
import { auth, db } from "@/app/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getErrorMessage } from "@/util/api/error";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
    });

    return NextResponse.json({
      message: "회원가입 성공",
      user: { email, name },
    });
  } catch (error: unknown) {
    console.error("회원가입 실패:", getErrorMessage(error));
    return NextResponse.json(
      { message: "회원가입 실패", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
