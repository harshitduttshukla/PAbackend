import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import rout from "./route.js"



dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use("/api",rout);




// ✅ Base route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
