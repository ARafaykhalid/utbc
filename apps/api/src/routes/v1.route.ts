import { Router } from "express";
import Routerv1 from "./v1/root.route";

const router: Router = Router();

router.use("/v1", Routerv1);

export default router;
