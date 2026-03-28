import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/updates");
      setRequests(res.data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    if(!window.confirm("Approve this update?")) return;
    try {
      await API.post(`/updates/approve/${id}`);
      fetchRequests();
    } catch(e) {
      alert("Failed to approve");
    }
  };

  const reject = async (id) => {
    if(!window.confirm("Reject this update?")) return;
    try {
      await API.post(`/updates/reject/${id}`);
      fetchRequests();
    } catch(e) {
      alert("Failed to reject");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />

      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Admin Panel
        </h1>
        <p className="text-white/50 mt-1">Review and manage pending product updates.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(r => (
          <div key={r._id} className="glass-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-full">
                <h3 className="text-xl font-bold text-white mb-1"><span className="text-white/40 font-normal text-sm block">Product:</span> {r.productId?.name || 'Deleted Product'}</h3>
                
                <div className="mt-4 space-y-1 bg-white/5 rounded-xl p-3 border border-white/10 w-full">
                  {r.newName && <p className="text-sm"><span className="text-white/50">Requested Name/Price:</span> <br/><span className="font-semibold text-white">{r.newName}</span></p>}
                  {r.newPrice && <p className="text-sm mt-1"><span className="font-bold text-indigo-400 text-lg">₹ {r.newPrice}</span></p>}
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-4">
                <span className="text-sm text-white/50 mr-2">Status:</span>
                {r.status === "PENDING" && <span className="badge-pending">Pending</span>}
                {r.status === "APPROVED" && <span className="badge-approved">Approved</span>}
                {r.status === "REJECTED" && <span className="badge-rejected">Rejected</span>}
              </div>

              {r.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => approve(r._id)}
                    className="btn-success w-full py-2 flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Approve
                  </button>
                  <button
                    onClick={() => reject(r._id)}
                    className="btn-danger w-full py-2 flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="col-span-full text-center py-20 text-white/50">
            No pending requests to review.
          </div>
        )}
      </div>
    </div>
  );
}