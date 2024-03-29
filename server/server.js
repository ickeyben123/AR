// import dependencies and initialize express
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Role from './models/roles.js'
import cookieSession from 'cookie-session';
import cron from 'node-cron';
import { createProxyMiddleware } from 'http-proxy-middleware';
import webPush from 'web-push';

import { fileURLToPath } from 'url';

import healthRoutes from './routes/health-route.js';
import swaggerRoutes from './routes/swagger-route.js';
import userRoutes from './routes/user-route.js';
import tagRoutes from './routes/tag-route.js'

import User from './models/users.js'
import Tag from './models/tags.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Add mongodb functionality
import mongoose from 'mongoose';
import config from './config/db.js';

mongoose.set('strictQuery', true); // Make sure everything follows the schemas.

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

// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);

// configure debugging
app.use(morgan("dev"))

app.set('trust proxy', 1)
//Setup cookie session
app.use(
  cookieSession({
    name: "ar-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: false,
//    sameSite: 'none', ////FOR NGROK!
//    secure: true,     ////FOR NGROK!
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);


app.use(cors({origin:true,credentials: true}));
// define first route
app.get("/", (req, res) => {
  res.json("Backend response...");
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


webPush.setVapidDetails(
  "http://localhost:3000",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


// Schedule cron for forgotten tags:
cron.schedule("*/15 * * * * *", async function () {
  const users = await User.find();
  for await (let user of users) {
    if(user.vapidSubscription != null){
      var current = new Date().getTime();
      var tags =  await Tag.find({
        owner: user._id
      });
      for await (let tag of tags) {
        if(tag.dateModified){
          var oneDay = tag.dateModified.getTime() + 30* 1000; //(1 * 24 * 60 * 60 * 1000)
            if (current > oneDay && tag.placed==false && tag.notified==false) {
              console.log("Sending Push Notififcation");
              await webPush.sendNotification(user.vapidSubscription, tag.tagName);
              tag.notified = true;
              await tag.save();
            }
        }
      }
    }
  }
});


export default app;