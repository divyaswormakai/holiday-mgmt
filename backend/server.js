// Import the packages
const express = require('express'); //Framework for node application
const mongoose = require('mongoose'); // MongoDB connection, query
const bodyParser = require('body-parser'); // PArse the body into json values
const cors = require('cors'); //Cross Origin Resource Sharing: Let applications besides the current application access the APIs
const path = require('path'); // Parse the directory, current directory for the application
const morgan = require('morgan'); // Logging the requests and their status

require('dotenv').config(); //Enabling the accesss to .env file

// Create an instance for express
const app = express();

// Importing the routes
const LoginRoute = require('./routes/LoginRoute');
const AdminRoute = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const ErrorRoute = require('./routes/ErrorRoute');

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
