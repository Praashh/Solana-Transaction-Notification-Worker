import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { UserActivityDetailsType } from './types/user'
import { pushNotificationInQueue } from './services/redis-client'

const app = new Hono()
app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.post('/airdrop-webhook', async (c) => {
  const requestBody = await c.req.json();

  try {
    const fee = requestBody[0].fee;
    const event = requestBody[0].type;
    const signature = requestBody[0].signature;
    console.log("Data received by webhook:", requestBody);
    console.log("Instruction received by webhook:", requestBody[0].instructions);
    console.log("Account Data received by webhook:", requestBody[0].accountData);

    const totalSentLamp = requestBody[0].accountData[0].nativeBalanceChange;
    const sentLamp = totalSentLamp + fee;
    const receiverAdd = requestBody[0].accountData[1].account;

    const transactionData: UserActivityDetailsType = {
      pubKey: receiverAdd,
      transactionData: {
        amount: Math.abs(sentLamp),
        recieverPubkey: receiverAdd,
        TransferType: event,
        transactionLink: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
        message: `Airdropped ${Math.abs(sentLamp) / 1000000000}SOL to ${receiverAdd}`
      },
      type: "discord",
      userSendNotificationReference: "1058038360360370196"
    };
    await pushNotificationInQueue(transactionData);

    return c.json({ message: "fsdfsd", signature: requestBody[0].signature });
  } catch (error) {
    return c.json({ message: "Internal Server Error!" });
  }

})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
