import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import bodyParser from 'body-parser'; // Use 'import' for body-parser
import helmet from 'helmet'; // Use 'import' for helmet'
import ticketRoutes from "./routes/ticketRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import financeRoutes from "./routes/financeRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";


// Initialize the Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Port configuration
const port = process.env.PORT || 4000;



// // Set up Helmet for Content Security Policy
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       "script-src": ["'self'", "https://vercel.live"], // Allow scripts from vercel.live
//       "default-src": ["'self'"],
//     },
//   })
// );

// Middleware
app.use(express.json());
 app.use(bodyParser.json()); // Parse JSON bodies
 app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect Cloudinary
connectCloudinary();

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Start the server
app.listen(port, () => console.log('Server is running on port: ' + port));
