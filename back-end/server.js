import 'dotenv/config';
import express from 'express';
import connectDB from './config/mongodb.js';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import cartRouter from './routes/cartRoute.js';

const app = express();
const port = 4000;

connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.get('/', (req, res) => {
  res.send('API Working');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter);

app.listen(port, () => {
  console.log('Server started on PORT : ' + port);
});
