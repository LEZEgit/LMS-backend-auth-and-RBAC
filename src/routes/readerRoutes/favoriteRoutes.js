import express from "express";
import {
  addToFavorites,
  deleteFromFavorites,
  deleteManyFavorites,
  updateFavoriteItem,
} from "../../controllers/favoritesController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  addToFavoritesSchema,
  deleteFavoritesSchema,
  updateFavoriteItemSchema,
  deleteFavoriteParamsSchema,
  updateFavoriteParamsSchema,
} from "../../validators/favoritesValidator.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validateRequest(addToFavoritesSchema), addToFavorites);
router.delete(
  "/:id",
  validateRequest(deleteFavoriteParamsSchema, "params"),
  deleteFromFavorites,
);
router.delete(
  "/delete-many",
  validateRequest(deleteFavoritesSchema),
  deleteManyFavorites,
);
router.put(
  "/:id",
  validateRequest({
    body: updateFavoriteItemSchema,
    params: updateFavoriteParamsSchema,
  }),
  updateFavoriteItem,
);

export default router;
