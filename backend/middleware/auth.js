import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // Check for token in token header
  else if (req.headers.token) {
    token = req.headers.token;
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication token is missing. Please log in again." 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format. Please log in again." 
      });
    }

    // Check if it's an admin token
    if (decoded.id.startsWith("admin_")) {
      // For admin tokens, we don't need to check the database
      req.user = {
        _id: decoded.id,
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        isAdmin: true
      };
      req.userId = decoded.id;
      next();
      return;
    }

    // For regular users, find the user in the database
    const user = await userModel.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User account not found. Please log in again." 
      });
    }

    // Check if user is active
    if (user.status === "inactive") {
      return res.status(401).json({ 
        success: false, 
        message: "Your account is inactive. Please contact support." 
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Your session has expired. Please log in again." 
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. Please log in again." 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed. Please log in again." 
    });
  }
};

export default authUser;
