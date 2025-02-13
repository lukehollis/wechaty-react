# Wechaty - React Client with @chatscope/chat-ui-kit-react

A React-based chat interface for Wechaty, built using [@chatscope/chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react) for the UI components so that you can connect to your wechaty backend from a web browser.  


## Setup and Installation

You'll need to run the wechaty backend and react client locally for development to integrate with your project: 

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd wechaty-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

## Running with your Wechaty Backend

1. Navigate to your Wechaty backend directory:
   ```bash
   cd ~/your/wechaty
   ```

2. Copy the `scripts/simple-websocket-bot.ts` to your Wechaty backend examples directory:
   ```bash
   cp scripts/simple-websocket-bot.ts ~/your/wechaty/examples
   ```

3. Start the WebSocket server (simple ding/dong example):
   ```bash
   node --loader ts-node/esm examples/simple-websocket-bot.ts
   ```

4. Open a browser and go to `http://localhost:3000` - the React client will automatically connect to the WebSocket server (default: ws://localhost:8788)

5. Type 'ding' in the chat input and send - you should receive a 'dong' response!

## Configuration

The chat widget can be configured through the `window.CHAT_CONFIG` object or environment variables:

```javascript
window.CHAT_CONFIG = {
  websocketUrl: 'ws://localhost:8788',  // WebSocket server URL
  avatarUrl: '/account-outline.svg',    // Avatar image URL
  userName: 'User'                      // Default username
}
```

## Development

- The project uses Webpack for bundling
- Development server runs on port 3000 by default
- WebSocket connection is handled in `ChatWidget.js`
- UI components from @chatscope/chat-ui-kit-react are used for the chat interface

## Extending Wechaty Integration

The current implementation provides a simple ding/dong example, but it can be extended to support full Wechaty functionality. The WebSocket server (`examples/simple-websocket-bot.ts`) can be enhanced to support various Wechaty features:

### Message Types

The WebSocket communication uses JSON messages with the following structure:

```javascript
// Client to Server
{
  type: 'sendMessage',
  to: 'Contact Name',    // Name of the contact to send to
  text: 'Hello World'    // Message content
}

// Server to Client (Wechaty Events)
{
  type: 'scan',         // QR Code scan event
  qrcode: '...',        // QR Code data
  status: '...'         // Scan status
}

{
  type: 'login',        // Login event
  user: 'Bot Name'      // Name of the logged-in user
}

{
  type: 'message',      // Incoming message event
  messageType: '...',   // Wechaty message type
  text: '...',          // Message content
  sender: '...'         // Sender name
}
```
