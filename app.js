import express from "express";
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to this Saccos</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

