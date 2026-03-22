const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db.js');
const userRoutes = require('./routes/user.route.js');
const authRoutes = require('./routes/auth.route.js');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// testing route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is running successfully!' });
});

// User API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});
