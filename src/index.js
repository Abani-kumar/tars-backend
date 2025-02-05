import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection.js";
import cloudinaryConnect from "./config/cloudinaryConnection.js";
import userRoute from "./routes/authRoute.js";
import noteRoute from "./routes/noteRoute.js";
import fileUpload from "express-fileupload";

dotenv.config({
  path: "./.env",
});

const app = express();


app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));




app.use("/api/v1/auth", userRoute);
app.use("/api/v1/notes", noteRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at port no :${PORT}`);
});

connectDB();
cloudinaryConnect();
