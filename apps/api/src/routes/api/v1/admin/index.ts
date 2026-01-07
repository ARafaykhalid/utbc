import { Router } from "express";
import MediaRoute from "./media";
import AdminOrdersRoute from "./orders";
import AdminManagedUserRoute from "./users";

const AdminRoute: Router = Router();

AdminRoute.use("/users", AdminManagedUserRoute);

AdminRoute.use("/media", MediaRoute);
AdminRoute.use("/orders", AdminOrdersRoute);

export default AdminRoute;
