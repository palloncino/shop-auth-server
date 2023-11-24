await import('dotenv/config');
import cookieParser from "cookie-parser";
import cors from 'cors';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { router as apiRouter } from './api/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Balling ⛹🏾‍♂️ on port ${PORT} 🪐`);
});
