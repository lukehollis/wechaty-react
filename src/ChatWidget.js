import React from 'react';
import { useChat, ChatMessage, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageGroup,
  MessageInput,
  ConversationHeader,
  Avatar
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

// Get configuration from window object or environment
const config = {
  websocketUrl: window.CHAT_CONFIG?.websocketUrl || 'ws://localhost:8000/ws/characters/',
  avatarUrl: window.CHAT_CONFIG?.avatarUrl || '/account-outline.svg',
  userName: window.CHAT_CONFIG?.userName || 'User'
};

const ChatWidget = () => {
  const { 
    currentMessages, 
    sendMessage,
    activeConversation
  } = useChat();

  const handleSend = (messageText) => {
    sendMessage({
      message: new ChatMessage({
        content: messageText,
        contentType: MessageContentType.TextHtml,
        senderId: config.userName,
        direction: MessageDirection.Outgoing,
        status: MessageStatus.Sent
      }),
      conversationId: activeConversation?.id,
      senderId: config.userName
    });
  };

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <Avatar src={config.avatarUrl} name={config.userName} />
            <ConversationHeader.Content userName={config.userName} />
          </ConversationHeader>
          <MessageList>
            {currentMessages.map(group => (
              <MessageGroup key={group.id} direction={group.direction}>
                <MessageGroup.Messages>
                  {group.messages.map(msg => (
                    <Message 
                      key={msg.id}
                      model={{
                        type: "text",
                        payload: msg.content
                      }}
                    />
                  ))}
                </MessageGroup.Messages>
              </MessageGroup>
            ))}
          </MessageList>
          <MessageInput onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatWidget;
