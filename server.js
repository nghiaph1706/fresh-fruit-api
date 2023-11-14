import express from 'express';
import { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './app/config/db.connection.js'; // Assuming this is your Sequelize connection file
import routes from './app/routes'; // Assuming your routes are defined in this folder

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

// Use the connection function to establish the database connection
connection();

// Use the routes defined in the router
app.use('/api', routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
