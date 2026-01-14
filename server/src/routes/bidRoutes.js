import express from "express";
import {
  placeBid,
  getGigBids,
  hireBidder,
} from "../controllers/bidController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔎 TEMP TEST ROUTE — ADD THIS */
router.get("/test", (req, res) => {
  res.send("BID ROUTE WORKING");
});

/* REAL ROUTES */
router.post("/", protect, placeBid);
router.get("/:gigId", protect, getGigBids);
router.post("/hire", protect, hireBidder);

export default router;
