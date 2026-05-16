const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db.js');
const userRoutes = require('./routes/user.route.js');
const authRoutes = require('./routes/auth.route.js');
const adminV1Routes = require('./routes/adminV1.route.js');
const engineerV1Routes = require('./routes/engineerV1.route.js');
const userV1Routes = require('./routes/userV1.route.js');

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

// IMS documented v1 API routes
app.use('/v1/user', userV1Routes);
app.use('/v1/engineer', engineerV1Routes);
app.use('/v1/admin', adminV1Routes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({ message: `${field} already exists` });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid id format' });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});
