// Import the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

require('dotenv').config();

// Cron job import
const cron = require('node-cron');

// Create an instance for express
const app = express();

// Importing the routes
const LoginRoute = require('./routes/LoginRoute');
const AdminRoute = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const ErrorRoute = require('./routes/ErrorRoute');

// Middlewares
const adminAuth = require('./middleware/adminAuth');
const userAuth = require('./middleware/userAuth');

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms')
);

// Apply the bodyParser middleware, to get json data from requests (Body)
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.set('view engine', 'jade');
app.use(express.urlencoded({ extended: false }));

// Apply the routes
app.use('/api/uploads', express.static(path.join(`${__dirname}/uploads`)));
app.use('/api/login', LoginRoute);
app.use('/api/user', UserRoute);
app.use('/api/admin', AdminRoute);
app.use('/*', ErrorRoute);
// app.use('*', (req, res) =>
// 	res.sendFile(path.join(`${__dirname}/build`, 'index.html'))
// );

// Get the mongoURI for database
const db = require('./config/keys').mongoURI;

// Connecting with database
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	// If all run ok, console log the message
	.then(() => console.log('MongoDB connected'))
	// For console log any error
	.catch((err) => console.log(err));

// Port declaration
const port = process.env.PORT || 3001;

// Init the express.js server
app.listen(port, () => console.log(`Server running on ${port}`));
