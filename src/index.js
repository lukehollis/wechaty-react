import './main.css'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatProvider, BasicStorage } from "@chatscope/use-chat";
import { nanoid } from "nanoid";
import ChatWidget from './ChatWidget'; 
import { WebSocketChatService } from './services/WebSocketChatService';

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();

// Get configuration from window object or environment
const config = {
  websocketUrl: window.CHAT_CONFIG?.websocketUrl || 'ws://localhost:8000/ws/characters/'
};

// Create serviceFactory
const serviceFactory = (storage, updateState) => {
  return new WebSocketChatService(storage, updateState, config.websocketUrl);
};

const chatStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});

// log version
console.log("💬 v0.0.1");

const chatRoot = document.querySelector('#chat-container');

const root = createRoot(chatRoot);
root.render(
  <ChatProvider serviceFactory={serviceFactory} storage={chatStorage}>
    <ChatWidget />
  </ChatProvider>
);