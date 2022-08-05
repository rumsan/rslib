const crypto = require("crypto");
const { loadNodeModule } = require("../utils/core");
const { isJsonObject } = require("../utils/typeUtils");
const { validateJwtToken } = require("../utils/cryptoUtils");
const { RSConfig } = require("../");

class WebSocketService {
  clients = [];
  actions = {
    get_id(ws) {
      ws.sendJson({ action: "id", data: { id: ws.rsid } });
    },
    ping(ws, data, me) {
      let message = "received";
      const client = me.getClient(ws.rsid);
      if (!client) message = "client does not exist.";
      const { accessToken } = data;
      if (accessToken) {
        const tData = validateJwtToken(accessToken, RSConfig.get("secret"), {
          ip: ws._socket.remoteAddress,
        });
        client.ip = ws._socket.remoteAddress;
        client.userId = tData.userId;
        message = `Hello to userId:${client.userId} from ${client.ip}`;
      }
      ws.sendJson({
        action: "pong",
        data: { text: message },
      });
    },
  };

  init(options) {
    if (options.actions) this.actions = { ...this.actions, ...options.actions };
    delete options.actions;
    options.clientTracking = options.clientTracking || true;

    const WebSocket = loadNodeModule("ws");
    const WSServer = new WebSocket.Server(options);
    WSServer.on("connection", (ws, msg) => {
      this.onConnection(ws, msg);
    });
  }

  addAction(name, action) {
    if (!name || !action) throw new Error("Must send both name and action.");
    this.actions.push({ name, action });
  }

  sendJson(ws, data) {
    if (typeof data === "string") data = { text: data };
    ws.send(JSON.stringify(data));
  }

  getClient(id) {
    if (!id) return "Please send client id";
    return this.clients.find((d) => d.id === parseInt(id, 10));
  }

  getClientList() {
    return this.clients.map((d) => d.id);
  }

  sendToClient(id, action, data) {
    try {
      const client = this.getClient(id);
      if (!client) throw new Error("WS: Invalid Client ID.");
      if (typeof data === "string") data = { text: data };
      return client.ws.sendJson({ action, data });
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  sendToUser(userId, action, data) {
    try {
      if (!userId) return "Please send user id";
      const clients = this.clients.filter((d) => d.userId === userId);
      if (!clients.length) throw new Error("WS: No registered client found");
      if (typeof data === "string") data = { text: data };
      clients.forEach(function each(client) {
        data.id = client.id;
        client.ws.sendJson({ action, data });
      });
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  onMessage(ws, data) {
    if (isJsonObject(data, true)) data = JSON.parse(data);
    else data = { action: data.toString() };
    try {
      if (!data.action) throw new Error("Must send action.");
      let selAction = this.actions[data.action];
      if (!selAction) throw new Error(`Not supported action [${data.action}]`);
      selAction(ws, data.data, this);
    } catch (e) {
      ws.sendJson({
        action: "error",
        message: e.message,
      });
    }
  }

  broadcast(data, action) {
    action = action || "broadcast";
    if (typeof data === "string") data = { text: data };
    this.clients.forEach(function each(client) {
      client.ws.sendJson({ action, data });
    });
  }

  onClose(a, b, ws) {
    this.clients = this.clients.filter((d) => d.id !== ws.rsid);
    console.log(`==== WS: ClienID ${ws.rsid} left ====`);
  }

  onConnection(ws) {
    ws.sendJson = (data) => this.sendJson(ws, data);
    ws.rsid = Math.floor(Math.random() * 999999 + 100000);
    this.clients.push({ id: ws.rsid, ws });
    ws.on("close", (a, b) => {
      this.onClose(a, b, ws);
    });
    ws.on("message", (msg) => {
      this.onMessage(ws, msg);
    });
    ws.sendJson({ action: "welcome", data: { clientId: ws.rsid } });
  }
}

module.exports = new WebSocketService();
