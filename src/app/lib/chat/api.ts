import { HttpMethod } from "@/shared";
import { customFetch } from "@/util/api";
import {
  ChatRoom,
  CreateChatRoomRequestDto,
  CreateChatRoomResponseDto,
} from ".";

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  return await customFetch<ChatRoom[]>("/api/chat/chat-rooms", {
    method: HttpMethod.GET,
  });
}

export async function createChatRoom(
  requestDto: CreateChatRoomRequestDto
): Promise<CreateChatRoomResponseDto> {
  return await customFetch<CreateChatRoomResponseDto>("/api/chat/chat-rooms", {
    method: HttpMethod.POST,
    body: JSON.stringify(requestDto),
  });
}
