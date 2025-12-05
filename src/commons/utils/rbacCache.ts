import { redis } from "@/configs/redis.config";

export async function clearRbacWorkspaceCache(workspaceId: string, userId: string) {
  const cacheKey = 'workspace_permissions_' + workspaceId + '_' + userId;
  await redis.del(cacheKey);
}

export async function clearRbacBoardCache(boardId: string, userId: string) {
  const cacheKey = 'board_permissions_' + boardId + '_' + userId;
  await redis.del(cacheKey);
} 