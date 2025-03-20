"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controllers/noteController");
const router = express_1.default.Router();
exports.noteRoutes = router;
router.post("/", noteController_1.createNoteController);
router.get("/user/:id", noteController_1.getNotesController);
router.put("/", noteController_1.updateNotesController);
router.delete("/", noteController_1.deleteNotesController);
router.get("/:id", noteController_1.getNoteByIdController);
router.delete("/:id", noteController_1.deleteNoteByIdController);
router.put("/:id", noteController_1.updateNoteController);
router.get("/search", noteController_1.searchNotesController);
router.post("/semantic-query", noteController_1.semanticQueryController);
