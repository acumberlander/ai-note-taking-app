"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
exports.userRoutes = router;
router.post("/", userController_1.createUserController);
router.get("/:id", userController_1.fetchUserController);
router.get("/:id/notes", userController_1.fetchUserNotesController);
