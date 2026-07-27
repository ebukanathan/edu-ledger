import { Router } from "express";
import * as controller from "./platform.controller";

const router = Router();

// Intentionally unauthenticated: school registration is a public
// self-service flow (linked from the homepage), not a platform-admin action.
router.post("/schools", controller.onboardSchool);

export default router;
