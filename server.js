import 'dotenv/config'
import express from 'express';
import connectDB from './config/mongodb.js';

const app = express();

connectDB();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('Server started on PORT : ' + port));
