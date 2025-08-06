import 'dotenv/config'
import express from 'express'
import connectToDB from './config/db';
import {APP_ORIGIN, PORT} from './constants/env'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/auth.route';
import authenticate from './middleware/authenticate';
import userRoutes from './routes/user.route';
import sessionRoutes from './routes/session.route';
import postRoutes from './routes/post.route';

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(cors({
    origin : [APP_ORIGIN, APP_ORIGIN.replace(/\/$/, ''), APP_ORIGIN + '/'],
    credentials : true
}));

app.use(cookieParser());

app.get('/', async (req, res, next) => {
    res.status(200).json({status : 'healthy'});
})

app.use('/auth', authRoutes);

//protected routes
app.use('/user', authenticate, userRoutes)
app.use('/sessions', authenticate, sessionRoutes)
app.use('/posts', authenticate, postRoutes)

// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    });
});

app.use(errorHandler);

app.listen(PORT, async () =>  {
    await connectToDB();
    console.log(`Listening on ${process.env.PORT}`)
})