import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [updName, setUpdName] = useState("");
  const [updPrice, setUpdPrice] = useState("");
  
  const [updateStatusMap, setUpdateStatusMap] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await API.post("/products", { name, price });
      setName("");
      setPrice("");
      fetchProducts();
    } catch(err) {
      alert("Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  const startUpdate = (p) => {
    setUpdatingId(p._id);
    setUpdName(p.name);
    setUpdPrice(p.price);
  };

  const submitUpdate = async (id) => {
    try {
      await API.post("/updates", { productId: id, newName: updName, newPrice: updPrice });
      setUpdatingId(null);
      setUpdateStatusMap({...updateStatusMap, [id]: "PENDING"});
    } catch(err) {
      alert("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Products Dashboard
          </h1>
          <p className="text-white/50 mt-1">Manage existing products or create new ones.</p>
        </div>
        
        {/* Create Product Form Inline */}
        <form onSubmit={createProduct} className="flex gap-3 glass-panel p-2 rounded-2xl w-full md:w-auto">
          <input
            className="input-glass py-2 px-4 rounded-xl text-sm w-full md:w-40"
            placeholder="Product Name"
            required
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <input
            className="input-glass py-2 px-4 rounded-xl text-sm w-full md:w-32"
            placeholder="Price (₹)"
            type="number"
            required
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="btn-success whitespace-nowrap px-6 py-2"
          >
            {isCreating ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="glass-card flex flex-col justify-between">
            {updatingId === p._id ? (
              <div className="space-y-4">
                <input 
                  className="input-glass"
                  value={updName}
                  onChange={e=>setUpdName(e.target.value)}
                  placeholder="New Name"
                />
                <input 
                  className="input-glass"
                  value={updPrice}
                  onChange={e=>setUpdPrice(e.target.value)}
                  type="number"
                  placeholder="New Price"
                />
                <div className="flex gap-2 mt-4">
                  <button onClick={() => submitUpdate(p._id)} className="btn-primary w-full py-2 flex justify-center items-center">
                    Submit
                  </button>
                  <button onClick={() => setUpdatingId(null)} className="btn-secondary w-full py-2 flex justify-center items-center">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{p.name}</h3>
                    <p className="text-2xl font-black text-indigo-400">₹ {p.price}</p>
                  </div>
                  {updateStatusMap[p._id] === "PENDING" && (
                     <span className="badge-pending">Update Requested</span>
                  )}
                </div>
                
                <button 
                  onClick={() => startUpdate(p)}
                  className="btn-secondary w-full py-3 flex items-center justify-center gap-2 mt-4 text-sm font-semibold"
                  disabled={updateStatusMap[p._id] === "PENDING"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  Request Update
                </button>
              </>
            )}
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-white/50">
            No products available. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}