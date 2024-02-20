import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.routes.js';
import voteRoutes from './routes/vote.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import dotenv from "dotenv";

const app = express();

app.set('view engine', 'ejs');

//PORT
dotenv.config();
const PORT = process.env.PORT || 5000

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', authRoutes);
app.use('/', voteRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(PORT,() => {
    connectToMongoDB();                 //to connect to MongoDB
    console.log(`Server is running on ${PORT}`)
})