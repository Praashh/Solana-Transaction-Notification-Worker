import { createClient } from "redis";
import dotenv from "dotenv";
import { UserActivityDetailsType } from "../types/user";
dotenv.config();

export const redis = createClient({
  // password: process.env.REDIS_PASSWORD as string || "MYSTRONGPASSWORD",
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT as unknown as number || 6379,
  },
});

(async function connectClient() {
  await redis.connect();
  console.log("connected to local redis server");
})();

export async function pushNotificationInQueue(
  transactionActivity: UserActivityDetailsType
) {
  const transactionActivityJSON = JSON.stringify({
    ...transactionActivity,
  });
  // console.log(transactionActivityJSON);
  await redis.lPush("notifications", transactionActivityJSON);
  console.log("pushed");
}

// console.log("passowrd", process.env.REDIS_PASSWORD);
// console.log("HOST", process.env.REDIS_HOST);
// console.log("PORT", process.env.REDIS_PORT);
