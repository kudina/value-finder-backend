import express from 'express'
import bodyParser from 'body-parser';
//import socket from 'socket.io'; 
import { MONGO_URL } from './config/index.js';
import mongoose from 'mongoose';
import cors from 'cors';

 
import { createServer } from 'http';
import { Server } from 'socket.io'; 
import { postMessage } from './controllers/User/ChatRoom.js';
import { ChatMessages } from './models/User/chatmessages.js';



const port = 5000 




const app = express();


const postmessage = postMessage;  

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
}) 

//even to show a user connected to our server via any view engine
io.on('connection', (socket) => {
  console.log(socket.id,'User connected');

    socket.on('message', (postmessage) => {
      socket.broadcast.emit('message', postmessage);
  }); 

    socket.on('disconnect',() => {
      console.log(socket.id, 'is disconnected!!!')
    }) 

    socket.emit('json',(message) => {
      console.log(message); 
    })
}); 



app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs'); //view engine others are hbs, html or react  
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: false,
//     method: ['GET', 'POST', 'PUT', 'DELETE'],

// }));
//app.use(crossOrigin());
//app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//import routes
import {userRoute, postRoute, roomRoute, chatMessagesRoutes, SocketRouter, contractRoute} from './routes/index.js';


//routes
app.use('/api/server', SocketRouter); 
app.use('/user', userRoute);
app.use('/post', postRoute); 
app.use('/room', roomRoute); 
app.use('/messages', chatMessagesRoutes); 
app.use('/contract', contractRoute);



app.get('/chat', (req, res) => {
  res.render('chat'); 
})

app.get('/', (req, res) => {
  res.send('Welcome to value finder, find jobs here ')
})

//connect to mongodb
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

httpServer.listen(process.env.PORT || port, () => {
    console.log(`Borrowlite listening at http://localhost:${port}`)
    }
)
