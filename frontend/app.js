function connect() {
  const socket = new WebSocket("wss://your-backend-url/api/ws");

  socket.onopen = () => {
    alert("Connected to game server");
    socket.send(JSON.stringify({ type: "join", user: "player1" }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Game data:", data);
  };

  socket.onerror = (err) => {
    console.error("Socket error:", err);
  };
}
