import express from "express";
import { Erro } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma: PrismaClient = new PrismaClient();

const apiUsersRouter: express.Router = express.Router();

apiUsersRouter.use(express.json());

// Get users from the database
apiUsersRouter.get(
   "/",
   async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      try {
         res.json(await prisma.kayttaja.findMany());
      } catch (e: any) {
         next(new Erro());
      }
   }
);

// Add a new user to the database. Requirements for datatypes shall be checked.
apiUsersRouter.post(
   "/",
   async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      if (
         req.body.kayttajatunnus?.length > 0 &&
         req.body.salasana?.length > 0
      ) {
         try {
            let hash = crypto
               .createHash("SHA512")
               .update(req.body.salasana)
               .digest("hex");
            await prisma.kayttaja.create({
               data: {
                  kayttajatunnus: req.body.kayttajatunnus,
                  salasana: hash,
               },
            });
            res.json(await prisma.kayttaja.findMany());
         } catch (e: any) {
            next(new Erro());
         }
      } else {
         next(new Erro(400, "Invalid request body"));
      }
   }
);

export default apiUsersRouter;
