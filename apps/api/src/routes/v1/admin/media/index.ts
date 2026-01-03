import { Router } from "express";
import {
  multerErrorHandler,
  requireFiles,
  upload,
  validate,
} from "@/middlewares";
import {
  AddMedia,
  DeleteMedia,
  GetMedia,
  UpdateMedia,
} from "@/controllers/media";
import {
  VAddMedia,
  VGetMediaQuery,
  VUpdateMediaBody,
  VUpdateMediaParams,
} from "@shared/validations";

const MediaRoute: Router = Router();

MediaRoute.post(
  "/",
  upload.array("files", 5),
  multerErrorHandler,
  requireFiles("files"),
  validate({ body: VAddMedia }),
  AddMedia
);

MediaRoute.get("/", validate({ query: VGetMediaQuery }), GetMedia);

MediaRoute.patch(
  "/:mediaId",
  validate({
    params: VUpdateMediaParams,
    body: VUpdateMediaBody,
  }),
  UpdateMedia
);

MediaRoute.delete(
  "/:mediaId",
  validate({ params: VUpdateMediaParams }),
  DeleteMedia
);

export default MediaRoute;
