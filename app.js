import express from "express";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("<h1>Welcome to this Saccos</h1>");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
