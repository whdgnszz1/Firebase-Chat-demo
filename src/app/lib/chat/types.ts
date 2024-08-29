export interface ChatRoom {
  id: string;
  name: string;
}

export interface CreateChatRoomRequestDto {
  name: string;
}

export interface CreateChatRoomResponseDto extends ChatRoom {}

export interface GetChatRoomResponseDto extends ChatRoom {}
