import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig } from "@/features/gigs/gigSlice";
import { useNavigate } from "react-router-dom";

export default function CreateGig() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.gigs);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
      })
    ).then(() => {
      navigate("/dashboard");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-2xl mx-auto">
        <div className={`bg-gray-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border-2 border-gray-700 transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
            <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Create a Gig
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
              <label className="block text-gray-300 text-lg font-semibold mb-2">
                Gig Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Build a responsive landing page"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border-2 border-gray-700 p-4 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
              />
            </div>

            <div className={`transform transition-all duration-700 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
              <label className="block text-gray-300 text-lg font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your project requirements in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full bg-gray-900 border-2 border-gray-700 p-4 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none"
              />
            </div>

            <div className={`transform transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
              <label className="block text-gray-300 text-lg font-semibold mb-2">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                placeholder="e.g., 50000"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border-2 border-gray-700 p-4 rounded-lg text-gray-100 text-lg placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
              />
            </div>

            <div className={`transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg text-xl font-semibold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading && (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  )}
                  {isLoading ? "Creating..." : "Create Gig"}
                </span>
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                )}
              </button>
            </div>

            <div className={`transform transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full text-gray-400 hover:text-orange-400 text-lg font-semibold transition-colors duration-300 py-2"
              >
                ← Back to Dashboard
              </button>
            </div>
          </form>
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

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}