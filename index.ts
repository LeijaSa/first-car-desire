import express from "express";
import errorhandler from "./errors/errorhandler";
import apiCarsRouter from "./routes/apiCars";
import apiUsersRouter from "./routes/apiUsers";
import path from "path";
import dotenv from "dotenv";

//Dotenv files are used to load environment variables from a .env file into the running process
dotenv.config();

const app: express.Application = express();

const port: number = Number(process.env.PORT);

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/cars", apiCarsRouter);

app.use("/api/users", apiUsersRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

//middleware -  error handling
app.use(errorhandler);

//middleware -  test if res has not been sent, the error is 404
app.use(
   (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      if (!res.headersSent) {
         res.status(404).json({ message: "Invalid path" });
      }
      next();
   }
);

app.listen(port, () => {
   console.log(`Server started at the port : ${port}`);
});
