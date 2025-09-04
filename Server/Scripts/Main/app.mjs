import express from "express";
import connect from "../Connection/index.mjs";
import userRoute from "../Routes/User_Routes/index.mjs";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "../Passport/LocalStrategy/index.mjs";
import "../Passport/GoogleStrategy/index.mjs";
import "../Passport/GithubStrategy/index.mjs";
import "../Passport/FacebookStrategy/index.mjs";
import storeDB from "../Store/Mongo_Session_Store.mjs";
import authRoute from "../Routes/User_Routes/ThirdReturnAuth/index.mjs";
import path from "path";
import courseRouter from "../Routes/Course_Routes/index.mjs";
import appRouter from "../Routes/Application_Routes/index.mjs";
import paymentRouter from "../Routes/Course_Routes/Payment_Routes/index.mjs";
import paymentSubRouter from "../Routes/Subscription_Routes/index.mjs";
import checkSubscription from "../Middlewares/CheckSubscription/index.mjs";
import setUpSocket from "../Services/UserService/Socket/index.mjs";
import http from "http";
import NotificationModel from "../Model/Notification_Model/index.mjs";
import notificationRouter from "../Routes/Notification_Routes/index.mjs";
import dotenv from "dotenv";
//Configuration of dotenv to excess the dotenv files
dotenv.config();

const DB_URL = process.env.MONGOOSE_URL;
const PORT = process.env.APP_PORT || 3000;
const CLIENT_URL = process.env.FRONTEND_URL;

const app = express();

const main = () => {
  //Database connection
  connect(DB_URL);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(
    cors({
      origin: [CLIENT_URL],
      methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  const store = storeDB(session);
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      store: store,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
      name: "hook",
    })
  );
  app.set("view engine", "ejs");
  app.set("views", path.join("./Scripts/Views/esewa"));
  app.use(express.static(path.resolve("./Scripts/Upload")));
  app.use(passport.initialize());
  app.use(passport.session());

  const server = http.createServer(app);
  app.use("/user", userRoute);
  app.use("/course", courseRouter);
  app.use("/subscription", paymentSubRouter);
  app.use(checkSubscription);
  app.use("/", authRoute);
  app.use("/application", appRouter);
  app.use("/payment", paymentRouter);
  app.use("/notification", notificationRouter);
  app.get("/noti", async (req, res) => {
    await NotificationModel.create({
      userId: "67e76af326bf886ac2c235fd",
      title: "hello man",
      message: "jsdjfsjdfkdskfksdfkdsfksdf",
      type: "system",
    });
    return res.end("helo");
  });
  server.listen(PORT, () => console.log("listining at port " + PORT));
  setUpSocket(server);
};
main();
