export type UserTransactionDataType = {
    TransferType: string;
    amount: number;
    recieverPubkey: string;
    transactionLink: string;
    message: string;
  };
  
  export type UserActivityDetailsType = {
    type: "email" | "discord" | "sms" | "telegram";
    userSendNotificationReference: string;
    pubKey: string;
    transactionData: UserTransactionDataType;
  };