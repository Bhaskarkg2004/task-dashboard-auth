const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/tasks');
const userRoute = require('./routes/user');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
