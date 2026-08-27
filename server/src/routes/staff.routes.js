const { Router } = require("express");
const staffController = require("../controllers/staff.controller");

const router = Router();

router.get("/", staffController.list);
router.post("/", staffController.create);
router.patch("/:id", staffController.update);
router.delete("/:id", staffController.remove);

module.exports = router;
