import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import {
  CreateChatRoomRequestDto,
  CreateChatRoomResponseDto,
  createChatRoom,
} from "..";

export const useCreateChatRoom = (
  options?: UseMutationOptions<
    CreateChatRoomResponseDto,
    ApiError,
    CreateChatRoomRequestDto
  >
) => {
  return useMutation<
    CreateChatRoomResponseDto,
    ApiError,
    CreateChatRoomRequestDto
  >({
    mutationFn: createChatRoom,
    ...options,
  });
};
