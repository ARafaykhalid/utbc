import { Router } from "express";
import AdminOrdersRoute from "./orders";
import AdminManagedUserRoute from "./users";

const AdminRoute: Router = Router();

AdminRoute.use("/users", AdminManagedUserRoute);
AdminRoute.use("/orders", AdminOrdersRoute);

export default AdminRoute;
