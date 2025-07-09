import express from "express";
const router = express.Router();
import {
  createFinance,
  getAllFinance,
  getFinanceById,
  updateFinance,
  deleteFinance,
  approveFinance,
} from "../controllers/financeController.js";

router.post("/", createFinance);

router.get("/", getAllFinance);

router.get("/:id", getFinanceById);

router.put("/:id", updateFinance);

router.delete("/:id", deleteFinance);

router.put("/:id/approve", approveFinance);

export default router;
