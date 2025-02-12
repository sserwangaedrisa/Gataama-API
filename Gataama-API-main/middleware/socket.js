const jwt = require('jsonwebtoken');
const db = require('./db');
const chatMessage = require('../controllers/chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('liveLocation', async (liveLocationData) => {
      try {
        // Decode token to get vendorId
        // const decoded = jwt.verify(liveLocationData.token, process.env.JWT_SECRET);
        // const vendorId = decoded.id;
        const vendorId = 9;

        console.log('Inside liveLocation', liveLocationData);

        // Update vendorLocation table
        const sql = `
          UPDATE "vendorLocation"
          SET status = $1, latitude = $2, longitude = $3, "socketId" = $4
          WHERE "vendorId" = $5
        `;
        const values = [
          1,
          liveLocationData.latitude,
          liveLocationData.longitude,
          socket.id,
          vendorId,
        ];

        await db.query(sql, values);
        console.log('Vendor location updated successfully');
      } catch (err) {
        console.error('Error updating vendor location:', err);
      }
    });

    // AI Chat bot
    socket.on('chatMessage', (messageData) =>
      chatMessage(io, socket, messageData),
    );

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
