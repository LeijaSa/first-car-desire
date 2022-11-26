import express from "express";

export class Erro extends Error {
   status: number;
   message: string;
   constructor(status?: number, message?: string) {
      super();
      this.status = status || 500;
      this.message = message || "An unexpected error occurred on the server";
   }
}
const errorhandler = (
   err: Erro,
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   res.status(err.status).json({ message: err.message });
   next();
};
export default errorhandler;
