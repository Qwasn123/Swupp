async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

class RocketChatService {
  constructor() {
    this.ws = null;
    this.messageCallbacks = new Set();
    this.connected = false;
    this.userId = null;
    this.authToken = null;
    this.username = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket("wss://chat.swu.social/websocket");

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.connected = true;
        this.send({ msg: "connect", version: "1", support: ["1"] });
        resolve();
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.connected = false;
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };
    });
  }

  reconnect() {
    setTimeout(() => {
      if (!this.connected) {
        this.connect();
      }
    }, 3000);
  }

  send(message) {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
    }
  }

  async login(username, password) {
    return new Promise(async (resolve, reject) => {
      const loginId = Date.now().toString();
      const passwordHash = await sha256(password);

      const loginCallback = (response) => {
        if (response.msg === "result" && response.id === loginId) {
          if (response.error) {
            reject(response.error);
          } else {
            this.userId = response.result.userId;
            this.authToken = response.result.authToken;
            this.username = username;
            localStorage.setItem("rocketChatUserId", this.userId);
            localStorage.setItem("rocketChatAuthToken", this.authToken);
            console.log("Logged in as:", this.userId);
            resolve(response.result);
          }
        }
      };

      this.messageCallbacks.add(loginCallback);

      this.send({
        msg: "method",
        method: "login",
        id: loginId,
        params: [
          {
            user: { username: username },
            password: {
              digest: passwordHash,
              algorithm: "sha-256",
            },
          },
        ],
      });
    });
  }

  async loginWithToken() {
    const userId = localStorage.getItem("rocketChatUserId");
    const authToken = localStorage.getItem("rocketChatAuthToken");

    if (!userId || !authToken) {
      throw new Error("No stored credentials");
    }

    return new Promise((resolve, reject) => {
      const loginId = Date.now().toString();

      const loginCallback = (response) => {
        if (response.msg === "result" && response.id === loginId) {
          if (response.error) {
            reject(response.error);
          } else {
            this.userId = userId;
            this.authToken = authToken;
            console.log("Logged in with token as:", this.userId);
            resolve(response.result);
          }
        }
      };

      this.messageCallbacks.add(loginCallback);

      this.send({
        msg: "method",
        method: "login",
        id: loginId,
        params: [
          {
            resume: authToken,
          },
        ],
      });
    });
  }

  async loadMessages(roomId, limit = 50) {
    return new Promise((resolve, reject) => {
      const methodId = Date.now().toString();

      const callback = (response) => {
        if (response.msg === "result" && response.id === methodId) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result.messages);
          }
        }
      };

      this.messageCallbacks.add(callback);

      this.send({
        msg: "method",
        method: "loadHistory",
        id: methodId,
        params: [roomId, null, limit, null],
      });
    });
  }

  async loadDirectMessages() {
    return new Promise((resolve, reject) => {
      const methodId = Date.now().toString();

      const callback = (response) => {
        if (response.msg === "result" && response.id === methodId) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result);
          }
        }
      };

      this.messageCallbacks.add(callback);

      this.send({
        msg: "method",
        method: "rooms/get",
        id: methodId,
        params: [
          {
            $filter: {
              type: "d", // 'd' means direct message
            },
          },
        ],
      });
    });
  }

  async createDirectMessage(username) {
    return new Promise((resolve, reject) => {
      const methodId = "472";

      const callback = (response) => {
        if (response.msg === "result" && response.id === methodId) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result);
          }
        }
      };

      this.messageCallbacks.add(callback);

      this.send({
        msg: "method",
        method: "createDirectMessage",
        id: methodId,
        params: [username],
      });
    });
  }

  sendMessage(roomId, message) {
    return new Promise((resolve, reject) => {
      const methodId = Date.now().toString();

      const callback = (response) => {
        if (response.msg === "result" && response.id === methodId) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result);
          }
        }
      };

      this.messageCallbacks.add(callback);

      this.send({
        msg: "method",
        method: "sendMessage",
        id: methodId,
        params: [
          {
            rid: roomId,
            msg: message,
          },
        ],
      });
    });
  }

  handleMessage(data) {
    // Handle different message types
    if (data.msg === "ping") {
      this.send({ msg: "pong" });
    } else if (
      data.msg === "changed" &&
      data.collection === "stream-room-messages"      // 监听消息更新
    ) {
      // New message received
      this.notifyNewMessage(data.fields.args[0]);
    }

    // Call all registered callbacks
    this.messageCallbacks.forEach((callback) => callback(data));
  }

  onNewMessage(callback) {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  notifyNewMessage(message) {
    this.messageCallbacks.forEach((callback) =>
      callback({
        msg: "newMessage",
        message,
      })
    );
  }

  subscribeToRoom(roomId) {

    const subscriptionId = Date.now() + Math.random().toString();
    this.send({
      msg: "sub",
      id: subscriptionId,
      name: "stream-room-messages",
      params: [roomId, false],
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const rocketChat = new RocketChatService();
