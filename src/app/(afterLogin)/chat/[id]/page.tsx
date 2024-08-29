"use client";

import { db } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ArrowLeft, Send, User } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string | Date;
}

const ChatRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState<boolean | null>(true);

  const roomId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const roomName = searchParams.get("name") || "";

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    if (!storedName || !roomId || !roomName) {
      router.push("/main");
    }

    const messagesQuery = query(
      collection(db, "chatRooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Message[];

      setMessages((prevMessages) => {
        const isAtBottom =
          scrollRef.current &&
          scrollRef.current.scrollHeight - scrollRef.current.clientHeight ===
            scrollRef.current.scrollTop;

        setShouldScroll(isAtBottom);

        return newMessages;
      });
    });

    return () => unsubscribe();
  }, [router, roomId, roomName]);

  useEffect(() => {
    if (shouldScroll) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScroll]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = {
      content: message,
      sender: userName,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "chatRooms", roomId, "messages"), newMessage);
      setMessage("");
      setShouldScroll(true);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleBack = () => {
    router.push("/main");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100 p-4">
      <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로
          </Button>
          <CardTitle className="text-2xl font-bold">{roomName}</CardTitle>
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-gray-400" />
            <span>{userName}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === userName ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === userName
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <p className="font-bold">{msg.sender}</p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="flex-shrink-0 p-4">
          <div className="flex w-full space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="mr-2 h-4 w-4" />
              전송
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatRoomPage;
