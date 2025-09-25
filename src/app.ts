import "reflect-metadata";
import "zod";

import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

import {buildOpenAPIRouter} from "./swagger/openAPIRouter";
import { appEnv } from "./configs";
import mainRouter from "./commons/router/index.router";
import passport from "passport";
import session from "express-session";
import { healthCheckRouter } from "./modules/healthCheck/healthCheck.router";

const app: Express = express();

app.use(express.json());

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors({ origin: appEnv.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan("combined"));

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
app.use('/api/v1/auth', mainRouter);

app.get("/", (_req, res) => {
  res.send('<a href="/api/v1/auth/google">Login with Google</a>');
});

app.use('/api-docs', buildOpenAPIRouter())

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(appEnv.PORT, () => {
  const { NODE_ENV, HOST, PORT } = appEnv;
  console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});