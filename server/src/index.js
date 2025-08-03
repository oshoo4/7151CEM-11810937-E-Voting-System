const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const voterRoutes = require('./routes/voterRoutes');
const ballotRoutes = require('./routes/ballotRoutes');
const voteRoutes = require('./routes/voteRoutes');
const resultsRoutes = require('./routes/resultsRoutes');
const faceRoutes = require('./routes/faceRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "https://delightful-smoke-0f598391e.1.azurestaticapps.net",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "https://delightful-smoke-0f598391e.1.azurestaticapps.net",
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/ballot', ballotRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/users', userRoutes);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server (with WebSockets) started on port ${PORT}`));
