import { Router } from "express";
import V1RootRouter from "./v1";

const APIRoute: Router = Router();

APIRoute.use("/v1", V1RootRouter);

export default APIRoute;
