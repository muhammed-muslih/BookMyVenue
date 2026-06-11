import redis from "@/config/redis";

export const storeRefreshToken = async (userId: string, token: string) => {
  await redis.setex(`refresh:${userId}`, 60 * 60 * 24 * 7, token);
};

export const getRefreshToken = async (userId: string) => {
  return redis.get(`refresh:${userId}`);
};

export const deleteRefreshToken = async (userId: string) => {
  return redis.del(`refresh:${userId}`);
};
