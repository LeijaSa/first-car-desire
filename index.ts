import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();

const port: number = Number(process.env.PORT);

app.use(express.static(path.resolve(__dirname, "public")));

app.listen(port, () => {
   console.log(`Server started at the port : ${port}`);
});
