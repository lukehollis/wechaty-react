import WebSocket, { WebSocketServer } from 'ws';
import {
  WechatyBuilder,
  ScanStatus,
  Message,
  Contact,
} from '../src/mods/mod.js';

// Initialize WebSocket Server
const wss = new WebSocketServer({ port: 8788 });
console.log('WebSocket server started on ws://localhost:8788');

// Initialize Wechaty
const wechaty = WechatyBuilder.build({
  name: 'websocket-bot',
});

// Store connected WebSocket clients
const clients = new Set<WebSocket>();

// Broadcast message to all connected clients
function broadcast(message: string) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  clients.add(ws);

  ws.on('message', async function incoming(message) {
    const messageStr = message.toString();
    console.log('received from client:', messageStr);

    if (messageStr === 'ding') {
      ws.send('dong');
    } else {
      // Handle other messages - could be forwarded to Wechaty
      // Example: Send message to a specific contact
      try {
        const parsedMessage = JSON.parse(messageStr);
        if (parsedMessage.type === 'sendMessage' && parsedMessage.to) {
          const contact = await wechaty.Contact.find({ name: parsedMessage.to });
          if (contact) {
            await contact.say(parsedMessage.text);
            ws.send(JSON.stringify({ status: 'sent', to: parsedMessage.to }));
          }
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Example wechaty event handlers
wechaty
  .on('scan', (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      broadcast(JSON.stringify({
        type: 'scan',
        qrcode,
        status,
      }));
    }
  })
  .on('login', (user: Contact) => {
    broadcast(JSON.stringify({
      type: 'login',
      user: user.name(),
    }));
  })
  .on('message', async (message: Message) => {
    const type = message.type();
    const text = message.text();
    const sender = message.talker();

    broadcast(JSON.stringify({
      type: 'message',
      messageType: type,
      text,
      sender: sender.name(),
    }));
  })
  .on('error', (error) => {
    console.error('Bot error:', error);
    broadcast(JSON.stringify({
      type: 'error',
      error: error.message,
    }));
  });

// Start the bot
wechaty.start()
  .then(() => console.log('Wechaty started.'))
  .catch(console.error);
