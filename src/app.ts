import "reflect-metadata";
import "zod";

import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import notificationGateway from "./modules/notifications/notification.gateway";

import {buildOpenAPIRouter} from "./swagger/openAPIRouter";
import { appEnv } from "./configs";
import mainRouter from "./commons/router/index.router";
import passport from "passport";
import session from "express-session";
import { healthCheckRouter } from "./modules/healthCheck/healthCheck.router";
import cookieParser from "cookie-parser";
import { errorHandler } from "./commons/exceptions/error.handler";

const app: Express = express();
const httpServer = createServer(app);
notificationGateway.initialize(httpServer);

app.use(express.json());
app.set("trsust proxy", true);
// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());

app.use(
  session({
    secret: appEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: appEnv.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/health-check", healthCheckRouter);
app.use('/api/v1', mainRouter);

app.get("/", (_req, res) => {
  res.send('<a href="/api/v1/auth/google">Login with Google</a>');
});

app.use(buildOpenAPIRouter())

app.use(errorHandler);

httpServer.listen(appEnv.PORT, () => {
  const { NODE_ENV, HOST, PORT } = appEnv;
  console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});