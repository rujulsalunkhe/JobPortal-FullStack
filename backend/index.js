import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'

dotenv.config({});

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173/',
    Credential: true
}

app.use(cors(corsOptions));

// api's
app.use('/api/v1/user', userRoute);

// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/update"


app.get('/home', (req, res) => {
    return res.status(200).json({
        message: 'hey this is backend',
        sucess: true
    })
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running at port ${PORT}`)
})