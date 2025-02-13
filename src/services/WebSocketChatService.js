class WebSocketChatService {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.onMessageCallback = null;
  }

  connect(onMessageCallback) {
    this.onMessageCallback = onMessageCallback;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  }
}

export { WebSocketChatService };
