import './main.css'
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './ChatWidget';

// log version
console.log("💬 v0.0.1");

const container = document.getElementById('chat-container');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChatWidget />
  </React.StrictMode>
);