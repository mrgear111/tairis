require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');



const app = express();
app.use(express.json());

// mongo connent
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/dashboard'));

app.listen(3000, () => console.log("Server running on 3000"));
