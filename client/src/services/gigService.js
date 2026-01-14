import axiosInstance from "@/utils/axiosInstance";

export const createGig = async (gigData) => {
  const res = await axiosInstance.post("/gigs", gigData);
  return res.data;
};

export const fetchGigs = async () => {
  const res = await axiosInstance.get("/gigs");
  return res.data;
};
