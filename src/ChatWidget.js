import React, { useState, useEffect, useRef } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  MessageModel
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

// Get configuration from window object or environment
const config = {
  websocketUrl: window.CHAT_CONFIG?.websocketUrl || 'ws://localhost:8788',
  avatarUrl: window.CHAT_CONFIG?.avatarUrl || '/account-outline.svg',
  userName: window.CHAT_CONFIG?.userName || 'User'
};

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(config.websocketUrl);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      console.log('Received:', event.data);
      const newMessage = {
        message: event.data,
        sentTime: "just now",
        sender: "Bot",
        direction: "incoming",
        position: "single"
      };
      setMessages(prev => [...prev, newMessage]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      const newMessage = {
        message: message,
        sentTime: "just now",
        sender: config.userName,
        direction: "outgoing",
        position: "single"
      };
      setMessages(prev => [...prev, newMessage]);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const handleSend = (message) => {
    sendMessage(message);
  };

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <Avatar src={config.avatarUrl} name="Wechaty Bot" />
            <ConversationHeader.Content userName="Wechaty Bot" info="Try sending 'ding'" />
          </ConversationHeader>
          <MessageList>
            {messages.map((msg, index) => (
              <Message key={index} model={msg}>
                <Message.Header sender={msg.sender} sentTime={msg.sentTime} />
                <Avatar src={config.avatarUrl} name={msg.sender} />
              </Message>
            ))}
          </MessageList>
          <MessageInput placeholder="Type 'ding' to test..." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatWidget;
