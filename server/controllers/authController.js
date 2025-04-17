const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../utils/validationSchema");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if(!req.body){
      return res.status(400).json({message : "Missing request body"});
    }

    const { name, email, phone, password } = req.body;

    // check if user is already exist
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist," });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration error : ", err);
    res.status(500).json({ message: "Server error." });
  }
};

const loginUser = async (req,res) => {
  try{
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if(!req.body){
      return res.status(400).json({message : "Missing request body"});
    }
    // destructure email and password
    const {email, password} = req.body;

    // check if user is already exist
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message : "user not found"});
    }

    // compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) 
      return res.status(400).json({message : "invalid password"});

    // Generate JWT token
    const token = jwt.sign({_id : user._id}, JWT_SECRET, {
      expiresIn: "1d",
    })

    // send response
    res.status(200).json({
      message : "Login successful",
      token,
      user:{
        _id:user._id,
        name : user.name,
        email : user.email,
      }
    })
  }catch(err){
    console.error("Login error : ", err);
    res.status(500).json({message : "Server error."});
  }
}

module.exports = { registerUser, loginUser };
