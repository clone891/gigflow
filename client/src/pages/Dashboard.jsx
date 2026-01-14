import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGigs } from "@/features/gigs/gigSlice";
import { logout } from "@/features/auth/authSlice";
import axios from "@/utils/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { gigs, isLoading } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [selectedGig, setSelectedGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ PER-GIG BID STATE
  const [bidInputs, setBidInputs] = useState({});

  useEffect(() => {
    dispatch(loadGigs());
    setIsVisible(true);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // -------- SEARCH FILTER --------
  const filteredGigs = gigs.filter((gig) =>
    `${gig.title} ${gig.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // -------- PLACE BID --------
  const handleBid = async (gig) => {
    const bidData = bidInputs[gig._id];

    if (!bidData?.amount || !bidData?.message) {
      alert("Please enter amount and message");
      return;
    }

    if (Number(bidData.amount) > gig.budget) {
      alert(`Bid amount cannot exceed ₹${gig.budget}`);
      return;
    }

    try {
      await axios.post("/bids", {
        gigId: gig._id,
        amount: Number(bidData.amount),
        message: bidData.message,
      });

      alert("Bid placed successfully");

      // ✅ clear only this gig's inputs
      setBidInputs((prev) => {
        const copy = { ...prev };
        delete copy[gig._id];
        return copy;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  // -------- VIEW BIDS (OWNER ONLY) --------
  const handleViewBids = async (gigId) => {
    try {
      const res = await axios.get(`/bids/${gigId}`);
      setSelectedGig(gigId);
      setBids(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Not authorized");
    }
  };

  // -------- HIRE --------
  const handleHire = async (bidId) => {
    try {
      await axios.post("/bids/hire", {
        gigId: selectedGig,
        bidId,
      });

      alert("Bidder hired successfully");
      setBids([]);
      setSelectedGig(null);
      dispatch(loadGigs());
    } catch (err) {
      alert(err.response?.data?.message || "Hiring failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className={`flex justify-between items-center mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Available Gigs
          </h1>
          <button
            onClick={handleLogout}
            className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/50"
          >
            <span className="relative z-10">Logout</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className={`mb-8 transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <input
            type="text"
            placeholder="Search gigs by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-700 px-5 py-4 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
          />
        </div>

        {/* CREATE GIG */}
        {user?.role === "owner" && (
          <div className={`mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              to="/create-gig"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/50"
            >
              <span className="text-2xl">+</span>
              <span className="relative z-10">Create Gig</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </div>
        )}

        {!isLoading && filteredGigs.length === 0 && (
          <p className="text-gray-400 text-center py-20 text-xl">No gigs match your search</p>
        )}

        {/* GIG LIST */}
        <div className="space-y-6">
          {filteredGigs.map((gig, index) => (
            <div
              key={gig._id}
              className={`bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700 p-6 rounded-xl transform transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <h2 className="text-2xl font-semibold text-orange-400 mb-3">
                {gig.title}
              </h2>
              <p className="text-lg text-gray-300 mb-4">{gig.description}</p>
              <p className="text-xl font-medium text-gray-100 mb-4">
                Budget: <span className="text-orange-500">₹{gig.budget}</span>
              </p>

              {/* BIDDER VIEW */}
              {user?.role === "bidder" && (
                <div className="mt-5 space-y-3 bg-gray-900/50 p-4 rounded-lg">
                  <input
                    type="number"
                    placeholder={`Enter bid (≤ ₹${gig.budget})`}
                    value={bidInputs[gig._id]?.amount || ""}
                    onChange={(e) =>
                      setBidInputs((prev) => ({
                        ...prev,
                        [gig._id]: {
                          ...prev[gig._id],
                          amount: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-800 border-2 border-gray-700 px-4 py-3 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />

                  <input
                    type="text"
                    placeholder="Message"
                    value={bidInputs[gig._id]?.message || ""}
                    onChange={(e) =>
                      setBidInputs((prev) => ({
                        ...prev,
                        [gig._id]: {
                          ...prev[gig._id],
                          message: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-800 border-2 border-gray-700 px-4 py-3 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />

                  <button
                    onClick={() => handleBid(gig)}
                    className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg text-lg font-semibold overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/50"
                  >
                    <span className="relative z-10">Place Bid</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              )}

              {/* OWNER VIEW */}
              {user?.role === "owner" && (
                <button
                  onClick={() => handleViewBids(gig._id)}
                  className="group relative mt-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-3 rounded-lg text-lg font-semibold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/50"
                >
                  <span className="relative z-10">View Bids</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              )}

              {/* BIDS LIST */}
              {selectedGig === gig._id && bids.length > 0 && (
                <div className="mt-6 border-t-2 border-gray-700 pt-5 animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Bids</h3>
                  <div className="space-y-3">
                    {bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg transform transition-all duration-300 hover:bg-gray-900/70"
                      >
                        <p className="text-lg text-gray-100">
                          <span className="font-semibold text-orange-400">{bid.bidderId.name}</span> — ₹{bid.amount}
                        </p>
                        <button
                          onClick={() => handleHire(bid._id)}
                          className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg text-lg font-semibold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/50"
                        >
                          <span className="relative z-10">Hire</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGig === gig._id && bids.length === 0 && (
                <p className="mt-5 text-lg text-gray-400 italic">No bids yet</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}