import express from "express";
import {
  getAllUsers,
  registerUser,
  deleteUser,
  resetPasswordByAdmin,
  deleteManyUsers,
  updateRole,
} from "../../controllers/crudReaderController.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  adminResetPasswordSchema,
  adminUpdateUserSchema,
  deleteUsersSchema,
  registerSchema,
  userIdParamsSchema,
} from "../../validators/crudReaderValidator.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
const router = express.Router();

// need a middleware here to verify that the user sending this request has role: ADMIN || role: ROOT_ADMIN

router.use(authenticate);

router.get("/", authorize(["ROOT_ADMIN", "ADMIN"]), getAllUsers);
router.post(
  "/",
  authorize(["ROOT_ADMIN", "ADMIN"]),
  validateRequest(registerSchema),
  registerUser,
);
router.delete(
  "/:id",
  authorize(["ROOT_ADMIN", "ADMIN"]),
  validateRequest(userIdParamsSchema, "params"),
  deleteUser,
);
router.delete(
  "/delete-many",
  authorize(["ROOT_ADMIN", "ADMIN"]),
  validateRequest(deleteUsersSchema),
  deleteManyUsers,
);
router.put(
  "/reset-password/:id",
  authorize(["ROOT_ADMIN", "ADMIN"]),
  validateRequest({
    body: adminResetPasswordSchema,
    params: userIdParamsSchema,
  }),
  resetPasswordByAdmin,
);
router.put(
  "/:id",
  authorize(["ROOT_ADMIN", "ADMIN"]),
  validateRequest({ body: adminUpdateUserSchema, params: userIdParamsSchema }),
  updateRole,
);

// another endpoint to delete multiple users by making a selection

export default router;
