import { UserModel } from "../models/user.js"; // Ensure this path is correct
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });

// Register User
const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        errors: [{ msg: "User Already Exists" }],
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({ name, email, password: hashPassword });
    const result = await newUser.save();
    
    // Remove password field before sending response
    result._doc.password = undefined;
    return res.status(201).json({ success: true, ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Login User
const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        errors: [{ msg: "User Not Registered" }],
      });
    }
    const isPasswordOk = await bcrypt.compare(password, userExist.password);
    if (!isPasswordOk) {
      return res.status(400).json({
        errors: [{ msg: "Wrong Password" }],
      });
    }
    const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    // Remove password field before sending response
    const user = { ...userExist._doc };
    delete user.password;

    return res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Auth Middleware
const Auth = (req, res) => {
  return res.status(200).json({ success: true, user: { ...req.user._doc } });
};

export { Register, Login, Auth };
