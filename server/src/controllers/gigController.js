import Gig from "../models/Gig.js";

/* CREATE GIG */
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* GET OPEN GIGS */
export const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


