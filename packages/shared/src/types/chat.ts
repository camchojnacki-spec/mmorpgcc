export enum ChatChannel {
  Say = "say",
  Party = "party",
  Guild = "guild",
  Zone = "zone",
  Global = "global",
  Whisper = "whisper",
  System = "system",
}

export interface ChatMessage {
  id: string;
  channel: ChatChannel;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  /** Present when channel is Whisper — the recipient's id. */
  targetId?: string;
}
