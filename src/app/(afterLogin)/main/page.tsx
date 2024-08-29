"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogOut, MessageSquarePlus } from "lucide-react";
import Cookies from "js-cookie";
import { AuthCookie } from "@/shared";
import { useCreateChatRoom, useGetChatRooms } from "@/app/lib/chat/hooks";

const MainPage: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [chatRoomName, setChatRoomName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName && storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
    } else {
      router.push("/login");
    }
  }, [router]);

  const { data: chatRooms, refetch } = useGetChatRooms();

  const { mutate: createChatRoom } = useCreateChatRoom({
    onSuccess: () => {
      setChatRoomName("");
      refetch();
    },
    onError: (error) => {
      console.error("채팅방 생성 실패:", error.message);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    Cookies.remove(AuthCookie.ACCESS_TOKEN);
    router.push("/login");
  };

  const handleCreateChatRoom = () => {
    if (chatRoomName.trim() === "") {
      alert("채팅방 이름을 입력하세요.");
      return;
    }

    const idToken = Cookies.get(AuthCookie.ACCESS_TOKEN);
    if (!idToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    createChatRoom({ name: chatRoomName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chat-Demo-App</CardTitle>
          <CardDescription>채팅방을 만들고 대화를 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <User className="h-12 w-12 text-gray-400" />
              <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="chatRoomName" className="mb-4">
                새 채팅방 이름
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="chatRoomName"
                  value={chatRoomName}
                  onChange={(e) => setChatRoomName(e.target.value)}
                  placeholder="채팅방 이름을 입력하세요"
                />
                <Button onClick={handleCreateChatRoom}>
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  생성
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">채팅방 목록</h3>
              <ul className="space-y-2">
                {chatRooms?.map((room) => (
                  <li
                    key={room.id}
                    className="border rounded p-2 cursor-pointer"
                  >
                    {room.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            © 2024 Chat-Demo-App. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MainPage;
