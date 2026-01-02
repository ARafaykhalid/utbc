import { Router } from "express";
import RootRouter from "./v1";

const V1Router: Router = Router();

V1Router.use("/v1", RootRouter);

export default V1Router;
