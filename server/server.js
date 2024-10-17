import express from 'express'
import cors from 'cors'
import env from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRouter from './routers/user.router.js'
import adminRouter from './routers/admin.router.js'
import stalfRouter from './routers/stalf.router.js'
import serviceRouter from './routers/service.router.js'
import comRouter from './routers/com.router.js'
import chalk from 'chalk'

env.config();

const app = express();
const dbConn = () => {
    mongoose.connect(process.env.MSTRING).then(() => {
        console.log(chalk.yellow.inverse.bold('DB is connected....'))
    }).catch((err) => {
        console.log(chalk.red.inverse.bold('Error in DB....'))
    })
}
const corsAllows = {
    origin: 'http://192.168.1.9:5173',
    methods: 'PUT, PATCH, GET, POST, UPDATE, DELETE',
    credentials: true
}

app.use(cors(corsAllows));
app.use(express.json());
app.use(cookieParser());
app.use('/api/admin', adminRouter);
app.use('/api/stalf', stalfRouter);
app.use('/api/user', userRouter);
app.use('/api/services', serviceRouter);
app.use('/api/com', comRouter);


app.listen(process.env.PORT, (err) => {
    if(err) {
        console.log('Error in Server....')
    } else {
        dbConn();
        console.log(chalk.green.inverse.bold(`Server is live on ${process.env.PORT}`))
    }
})