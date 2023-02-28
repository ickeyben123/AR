// import dependencies and initialize express
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Role from './models/roles.js'
import cookieSession from 'cookie-session';


import { fileURLToPath } from 'url';

import healthRoutes from './routes/health-route.js';
import swaggerRoutes from './routes/swagger-route.js';
import userRoutes from './routes/user-route.js';
import tagRoutes from './routes/tag-route.js'

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
    initial();
  })
  .catch(err => {
    console.log({ database_error: err });
  });


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}


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

//Setup cookie session
app.use(
  cookieSession({
    name: "ar-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);


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
app.use("/tag", tagRoutes);
app.use("/", healthRoutes);


// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

export default app;