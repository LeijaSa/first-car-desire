import express from "express";
import { Erro } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();
const apiCarsRouter: express.Router = express.Router();

apiCarsRouter.use(express.json());

// Get cars from the database to show
apiCarsRouter.get(
   "/",
   async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      try {
         res.json(
            await prisma.auto.findMany({
               where: {
                  kayttajaId: Number(res.locals.kayttaja.id),
               },
            })
         );
      } catch (e: any) {
         next(new Erro());
      }
   }
);

// Delete cars from the database based on the id
apiCarsRouter.delete(
   "/:id",
   async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      if (
         await prisma.auto.count({
            where: {
               id: Number(req.params.id),
            },
         })
      ) {
         try {
            await prisma.auto.delete({
               where: {
                  id: Number(req.params.id),
               },
            });

            res.json(
               await prisma.auto.findMany({
                  where: {
                     kayttajaId: Number(res.locals.kayttaja.id),
                  },
               })
            );
         } catch (e: any) {
            next(new Erro());
         }
      } else {
         next(new Erro(400, "Virheellinen id"));
      }
   }
);

// Add a new car to the database. Requirements for datatypes shall be checked.
apiCarsRouter.post(
   "/",
   async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      let kuva = req.body.kuvanUrl;
      if (kuva.length < 1) {
         kuva = "http://localhost:3109/images/ei_kuvaa_saatavilla.jpg";
      }
      let huomio = req.body.huomioita;
      if (huomio.length < 1) {
         kuva = "Ei huomioita";
      }
      if (
         req.body.malli?.length > 0 &&
         req.body.rekisteritunnus?.length > 0 &&
         req.body.vuosi?.length > 0 &&
         req.body.mittarilukema?.length > 0 &&
         req.body.myyntipaikka?.length > 0 &&
         req.body.hinta >= 0 &&
         typeof req.body.hinta == "number" &&
         req.body.verot >= 0 &&
         typeof req.body.verot == "number"
      ) {
         try {
            await prisma.auto.create({
               data: {
                  malli: req.body.malli,
                  rekisteritunnus: req.body.rekisteritunnus,
                  vuosi: req.body.vuosi,
                  moottorinKoko: req.body.moottorinKoko,
                  mittarilukema: req.body.mittarilukema,
                  hinta: req.body.hinta,
                  verot: req.body.verot,
                  myyntipaikka: req.body.myyntipaikka,
                  huomioita: huomio,
                  kuvanUrl: kuva,
                  kayttajaId: Number(res.locals.kayttaja.id),
               },
            });

            res.json(
               await prisma.auto.findMany({
                  where: {
                     kayttajaId: Number(res.locals.kayttaja.id),
                  },
               })
            );
         } catch (e: any) {
            next(new Erro());
         }
      } else {
         next(new Erro(400, "Invalid request body"));
      }
   }
);

export default apiCarsRouter;
