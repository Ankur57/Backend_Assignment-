import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || alert("Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 mx-auto flex items-center justify-center font-bold text-3xl text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-4">
            S
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Create Account</h2>
          <p className="text-white/50 mt-2">Join to request and manage products.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <input 
              className="input-glass"
              placeholder="Full Name" 
              required
              value={name}
              onChange={(e)=>setName(e.target.value)} 
            />
          </div>
          <div>
            <input 
              className="input-glass"
              placeholder="Email address" 
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)} 
            />
          </div>
          <div>
            <input 
              className="input-glass"
              placeholder="Password" 
              type="password" 
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex justify-center items-center gap-2 font-bold"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create Account"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account? <Link to="/" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}