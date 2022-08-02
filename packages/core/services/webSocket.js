const crypto = require("crypto");
const { loadNodeModule } = require("../utils/core");
const { isJsonObject } = require("../utils/typeUtils");

class WebSocketService {
  clients = [];
  actions = {
    get_id(ws) {
      ws.sendJson({ action: "id", data: { id: ws.rsid } });
    },
    register(ws, data, me) {
      const client = me.getClient(ws.rsid);
      client.name = data.name;
      ws.sendJson({
        action: "message",
        data: { message: `Registered as ${data.name}` },
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
    if (typeof data === "string") data = { message: data };
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

  onMessage(ws, data) {
    if (isJsonObject(data, true)) data = JSON.parse(data);
    else data = { action: data.toString() };
    try {
      if (data.action) {
        let selAction = this.actions[data.action];
        if (!selAction)
          return ws.sendJson({
            action: "error",
            message: `Not supported action [${data.action}]`,
          });
        if (selAction) selAction(ws, data, this);
      } else ws.sendJson({ action: "error", message: "Must send action." });
    } catch (e) {
      console.log("ERROR", e.message);
    }
  }

  broadcast(msg) {
    this.clients.forEach(function each(client) {
      client.ws.sendJson({ ...{ msg }, action: "broadcast" });
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
    ws.sendJson({ action: "welcome", clientId: ws.rsid });
  }
}

module.exports = new WebSocketService();