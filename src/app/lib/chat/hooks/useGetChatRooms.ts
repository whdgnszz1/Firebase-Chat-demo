import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CHAT_KEY, fetchChatRooms } from "..";
import { GetChatRoomResponseDto } from "../types";

export const useGetChatRooms = (
  options?: UseQueryOptions<GetChatRoomResponseDto[]>
) => {
  const queryOptions: UseQueryOptions<GetChatRoomResponseDto[]> = {
    queryKey: [CHAT_KEY, "ROOMS"],
    queryFn: fetchChatRooms,
    ...options,
  };

  const result = useQuery<GetChatRoomResponseDto[]>(queryOptions);

  return result;
};
