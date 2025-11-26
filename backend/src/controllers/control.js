const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne(
        { email }
    );

    if (exists){
         return res.status(400).json({ msg: "Email exists" });
    }


    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ msg: "User registered", userId: user._id });


  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};


const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};

module.exports = {
    register,
    login
}