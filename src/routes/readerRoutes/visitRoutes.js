import express from "express";
import {
  createVisit,
  getVisits,
  getVisit,
  updateVisit,
  deleteVisit,
  addVisitItem,
  updateVisitItem,
  deleteManyVisitItems,
} from "../../controllers/visitController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createVisitSchema,
  updateVisitSchema,
  visitParamsSchema,
  addVisitItemSchema,
  updateVisitItemSchema,
  visitItemParamsSchema,
  deleteVisitItemsSchema,
} from "../../validators/visitValidator.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validateRequest(createVisitSchema), createVisit);
router.get("/", getVisits);
router.get(
  "/:id",
  validateRequest({ params: visitParamsSchema }),
  getVisit,
);
router.put(
  "/:id",
  validateRequest({ body: updateVisitSchema, params: visitParamsSchema }),
  updateVisit,
);
router.delete(
  "/:id",
  validateRequest({ params: visitParamsSchema }),
  deleteVisit,
);

router.post(
  "/:id/items",
  validateRequest({ body: addVisitItemSchema, params: visitParamsSchema }),
  addVisitItem,
);
router.put(
  "/:id/items/:itemId",
  validateRequest({ body: updateVisitItemSchema, params: visitItemParamsSchema }),
  updateVisitItem,
);
router.delete(
  "/:id/items/delete-many",
  validateRequest({ body: deleteVisitItemsSchema, params: visitParamsSchema }),
  deleteManyVisitItems,
);

export default router;
