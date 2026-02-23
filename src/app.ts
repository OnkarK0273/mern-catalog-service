import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import logger from './config/logger';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import categoryRouter from './category/category-route';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.CLIENT_ORIGIN_URL,
    credentials: true,
  }),
);
// Http Logger (simplistic for now, usually morgan or winston-express)
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

app.use('/categories', categoryRouter);

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', env: config.NODE_ENV });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
