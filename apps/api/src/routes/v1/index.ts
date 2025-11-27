import { Request, Response, Router } from "express";

const Routerv1: Router = Router();

Routerv1.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api is Live!",
    status: "200 ok",
    version: "1",
    timeStamp: new Date().toISOString(),
  });
});

export default Routerv1;
