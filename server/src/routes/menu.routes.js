const { Router } = require("express");
const menuController = require("../controllers/menu.controller");

const router = Router();

router.get("/", menuController.list);
router.post("/", menuController.create);
router.patch("/:id", menuController.update);
router.delete("/:id", menuController.remove);

module.exports = router;
