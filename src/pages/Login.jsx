import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { Zap, Settings2, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const { token, user } = await login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-poppins">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding and Info */}
        <div className="space-y-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-2xl font-bold text-indigo-600">FitPulse</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Welcome back!
            </h1>
            <p className="text-slate-500 text-lg max-w-sm">
              Sign in to access your account and continue where you left off.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Fast & Secure</h3>
                <p className="text-sm text-slate-500">Enterprise-grade security</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Easy to Use</h3>
                <p className="text-sm text-slate-500">Intuitive interface</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-center md:justify-end">
          <div className="bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link to="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-500 underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
