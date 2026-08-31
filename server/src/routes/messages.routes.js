const { Router } = require("express");
const messagesController = require("../controllers/messages.controller");

const router = Router();

router.get("/", messagesController.list);
router.patch("/:id/status", messagesController.updateStatus);
router.post("/:id/reply", messagesController.reply);

module.exports = router;

