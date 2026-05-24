const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("join:case", (caseId) => {
      socket.join(`case:${caseId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });
  });
};

export default registerSocketHandlers;
