import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

/* ===================== PLACE BID ===================== */
export const placeBid = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const { gigId, amount, message } = req.body;

    if (!gigId || !amount || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res.status(400).json({ message: "Gig not open" });
    }

    // ✅ ENFORCE BUDGET RULE (IMPORTANT FIX)
    if (amount > gig.budget) {
      return res.status(400).json({
        message: `Bid amount cannot exceed gig budget (₹${gig.budget})`,
      });
    }

    const existingBid = await Bid.findOne({
      gigId,
      bidderId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({ message: "Already bid on this gig" });
    }

    const bid = await Bid.create({
      gigId,
      bidderId: req.user._id,
      amount,
      message,
      status: "pending",
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error("PLACE BID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== GET BIDS (OWNER ONLY) ===================== */
export const getGigBids = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 🔑 SAFE OWNER RESOLUTION
    const ownerId =
      gig.user ||
      gig.owner ||
      gig.ownerId ||
      gig.createdBy;

    if (!ownerId) {
      console.error("GIG OWNER FIELD MISSING:", gig);
      return res.status(500).json({
        message: "Gig owner field not defined in model",
      });
    }

    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId }).populate(
      "bidderId",
      "name email"
    );

    res.json(bids);
  } catch (error) {
    console.error("GET GIG BIDS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== HIRE BIDDER ===================== */
export const hireBidder = async (req, res) => {
  try {
    const { gigId, bidId } = req.body;

    if (!gigId || !bidId) {
      return res.status(400).json({
        message: "gigId and bidId required",
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 🔑 SAFE OWNER RESOLUTION
    const ownerId =
      gig.user ||
      gig.owner ||
      gig.ownerId ||
      gig.createdBy;

    if (!ownerId) {
      console.error("GIG OWNER FIELD MISSING:", gig);
      return res.status(500).json({
        message: "Gig owner field not defined",
      });
    }

    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // reject all bids for this gig
    await Bid.updateMany(
      { gigId },
      { status: "rejected" }
    );

    // hire selected bid
    const hiredBid = await Bid.findByIdAndUpdate(
      bidId,
      { status: "hired" },
      { new: true }
    );

    if (!hiredBid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    gig.status = "assigned";
    await gig.save();

    res.json({
      message: "Bidder hired successfully",
      hiredBid,
    });
  } catch (error) {
    console.error("HIRE BIDDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
