// import dependencies and initialize express
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';


import { fileURLToPath } from 'url';

import healthRoutes from './routes/health-route.js';
import swaggerRoutes from './routes/swagger-route.js';
import userRoutes from './routes/user-route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Add mongodb functionality
import mongoose from 'mongoose';
import config from './config/db.js';

//mongoose.set('strictQuery', true); // Make sure everything follows the schemas.

mongoose
  .connect(config.database)
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log({ database_error: err });
  });

const app = express();

// if production, enable helmet
/* c8 ignore next 3  */
if (process.env.VCAP_APPLICATION) {
  app.use(helmet());
}

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//registering cors
app.use(cors());

// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);

// configure debugging
app.use(morgan("dev"))

// define first route
app.get("/", (req, res) => {
  res.json("Hello lol?.");
});

// start node server
const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

app.use("/user", userRoutes);
app.use("/tags", tagRoutes);


// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

export default app;