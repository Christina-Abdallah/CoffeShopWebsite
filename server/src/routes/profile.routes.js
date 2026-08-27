const { Router } = require("express");
const profileController = require("../controllers/profile.controller");

const router = Router();

router.get("/", profileController.getProfile);
router.patch("/", profileController.updateProfile);
router.post("/emails", profileController.addProfileEmail);
router.delete("/emails/:id", profileController.deleteProfileEmail);

module.exports = router;