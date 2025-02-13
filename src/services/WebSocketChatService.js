import { BasicStorage, ChatMessage, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";
import { EventEmitter } from "events";

export class WebSocketChatService extends EventEmitter {
  constructor(storage, updateState, websocketUrl) {
    super();
    this.storage = storage;
    this.updateState = updateState;
    this.ws = new WebSocket(websocketUrl);
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Convert incoming message to ChatMessage format and update state
      this.updateState({
        type: "message.add",
        payload: {
          message: new ChatMessage({
            content: data.message,
            contentType: MessageContentType.TextHtml,
            senderId: data.sender,
            direction: data.sender === window.CHAT_CONFIG?.userName ? MessageDirection.Outgoing : MessageDirection.Incoming,
            status: MessageStatus.Sent
          }),
          conversationId: "default"
        }
      });
    };
  }

  sendMessage(message, conversationId) {
    this.ws.send(JSON.stringify({
      type: 'chat_message',
      message: message.content,
      sender: message.senderId
    }));

    // Store the message
    const newMessage = new ChatMessage({
      content: message.content,
      contentType: MessageContentType.TextHtml,
      senderId: message.senderId,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    this.updateState({
      type: "message.add",
      payload: {
        message: newMessage,
        conversationId: conversationId || "default"
      }
    });

    return Promise.resolve(newMessage);
  }
}
