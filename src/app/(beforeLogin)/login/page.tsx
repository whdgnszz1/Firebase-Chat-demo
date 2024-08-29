"use client";

import { auth } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthCookie, HttpContentType, HttpHeader, HttpMethod } from "@/shared";
import { IUserPayload } from "@/shared/interfaces/user";
import { customFetch } from "@/util/api";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { AlertCircle, Eye, EyeOff, Facebook, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const SignUpLoginPage: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [tab, setTab] = useState<string>("login");

  const handleError = (errorMessage: string): void => {
    setError(errorMessage);
    setTimeout(() => setError(""), 5000);
  };

  const signUp = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      await customFetch("/api/auth/signup", {
        method: HttpMethod.POST,
        headers: { [HttpHeader.CONTENT_TYPE]: HttpContentType.JSON },
        body: JSON.stringify({ email, password, name }),
      });

      setTab("login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      handleError("회원가입 실패. 다시 시도해주세요.");
    }
  };

  const signIn = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      const data: IUserPayload = await customFetch("/api/auth/login", {
        method: HttpMethod.POST,
        headers: { [HttpHeader.CONTENT_TYPE]: HttpContentType.JSON },
        body: JSON.stringify({ idToken }),
      });

      Cookies.set(AuthCookie.ACCESS_TOKEN, idToken, { expires: 1 });
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      router.push("/main");
    } catch (error) {
      console.error("로그인 실패:", error);
      handleError("로그인 실패. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const logOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    Cookies.remove(AuthCookie.ACCESS_TOKEN);
    console.log("로그아웃 성공");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Chat-Demo-App
          </CardTitle>
          <CardDescription className="text-center">
            채팅 데모 어플리케이션
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">회원가입</TabsTrigger>
              <TabsTrigger value="login">로그인</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={signUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hong@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form onSubmit={signIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">이메일</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="hong@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">비밀번호</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </TabsContent>
          </Tabs>
          {error && (
            <div
              className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">또는 계속하기</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3 text-center">
              아래 기능들은 현재 준비 중입니다.
            </p>
            <div className="flex flex-col space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <Facebook className="mr-2 h-4 w-4" /> 페이스북으로 가입하기
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <User className="mr-2 h-4 w-4" /> 구글로 가입하기
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="mt-4 text-xs text-center text-gray-700">
            회원가입 시, 이용 약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Lock className="text-gray-400 mr-1" size={16} />
            <span className="text-xs text-gray-500">
              귀하의 정보는 안전하게 보호됩니다.
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpLoginPage;
