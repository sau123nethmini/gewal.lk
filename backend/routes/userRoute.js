import express from 'express'
import { loginUser,registerUser,adminlogin,updateUser,deleteUser,verifyToken,getUserProfile,getAllUsers } from '../controllers/userController.js'
import upload from '../middleware/multer.js';
const userRouter=express.Router();
import nodemailer from 'nodemailer';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // your email
      pass: process.env.EMAIL_PASS   // your app password
    }
  });
  
  const sendEmail = async (email, otp) => {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
  };


userRouter.post('/register',upload.single("profilePic"),registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminlogin)
userRouter.put("/update/:id", upload.single("profilePic"), updateUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.get('/profile',verifyToken, getUserProfile);
userRouter.get('/all', getAllUsers);

userRouter.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    const otp = generateOTP();
  
    try {
      await sendEmail(email, otp);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send OTP', error });
    }
  });
  
  

export default userRouter;