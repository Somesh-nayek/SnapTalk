import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map<string, WebSocket[]>();
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  ws.on("message", function message(data) {
    const message = JSON.parse(data.toString());
    try{
      if (message.type === "newRoom") {
        const code = generateRoomCode(6);
        console.log("room created with code " + code);
        rooms.set(code, [ws]);
        ws.send(JSON.stringify({ type: "roomCode", payload: { code: code } }));//
      } else if (message.type === "joinRoom") {
        const code = message.payload.roomCode;
        if (rooms.has(code)) {
          rooms.get(code)?.push(ws);
          ws.send(
            JSON.stringify({ type: "joinedRoom", payload: { code: code } })//
          );
        } else {
          ws.send(JSON.stringify({ type: "invalidRoomCode" }));//
        }
      } else if(message.type==="message"){
        const code = message.payload.roomCode;
        if (rooms.has(code)) {
          rooms.get(code)?.forEach((client) => {
            if (client !== ws) {
              const val=message.payload.message;
              client.send(JSON.stringify({type:"message",payload:{message:val}}));
            }
          });
        } else {
          ws.send(JSON.stringify({ type: "invalidRoomCode" }));
        }
      }else{
        ws.send(JSON.stringify({ type: "invalidMessage" }));
      }
    }catch(e){
      ws.send(JSON.stringify({ type: "invalidMessage" }));
    }
  });
  ws.on("close", () => {
    for (const [key, wsArray] of rooms.entries()) {
      if (wsArray.includes(ws)) {
        const updatedArray = wsArray.filter((WebSocket) => WebSocket !== ws);
        if (updatedArray.length > 0) {
          rooms.set(key, updatedArray);
        } else {
          rooms.delete(key);
        }
        break;
      }
    }
  });
  ws.send(JSON.stringify({ type: "connected" }));
});
function generateRoomCode(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
