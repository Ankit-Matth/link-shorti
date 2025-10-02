'use client';

import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function JoinUsPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="relative w-full lg:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden lg:h-[520px] min-h-[640px] sm:min-h-[600px] lg:min-h-0 flex flex-col">
        
        <div className="w-full py-4 text-center text-3xl font-extrabold bg-gray-800 text-white">
          LinkShorti
        </div>

        <div className="flex-1 relative lg:flex lg:flex-row h-full">
          <div
            className={`
              hidden lg:flex w-full lg:w-1/2 p-8 lg:p-12 text-white bg-gradient-to-br from-cyan-500 to-blue-600 flex-col justify-center items-center transition-all duration-700 ease-in-out h-full
              ${isLogin 
                ? 'lg:translate-x-full'
                : 'lg:translate-x-0'
              }
            `}
          >
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                {isLogin ? 'Hello, Friend!' : 'Welcome Back!'}
              </h2>
              <p className="mb-8 text-sm lg:text-base">
                {isLogin
                  ? 'Enter your personal details and start your journey with us'
                  : 'To keep connected with us please login with your personal info'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-white hover:text-cyan-500 transition-all duration-300 cursor-pointer text-sm lg:text-base"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>

          <div
            className={`
              absolute lg:relative w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 bg-white transition-all duration-700 ease-in-out transform h-full overflow-y-auto
              ${isLogin 
                ? 'lg:-translate-x-full'
                : 'lg:translate-x-0'
              }
            `}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>

            <div className="w-full px-8 flex justify-center lg:hidden flex-shrink-0 pt-6 pb-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full max-w-sm font-bold py-3 px-8 rounded-full border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300 cursor-pointer text-sm"
              >
                {isLogin ? 'Need an Account? Sign Up' : 'Already have an Account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/join-now', { email, password });

      if (res.data.success) {
        router.push("/");
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center w-full max-w-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="text-gray-400 h-5 w-5" /> : <Eye className="text-gray-400 h-5 w-5" />}
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
        >
          {loading ? 'Logging in...' : <><span>Login</span><ArrowRight className="ml-2 h-5 w-5" /></>}
        </button>
      </form>
    </div>
  );
}

function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/join-now', { name, email, password });

      if (res.data.success) {
        const autoLoginRes = await axios.post('/api/join-now', { email, password });
        if (autoLoginRes.data.success) {
          router.push("/");
        } else {
          throw new Error("Internal server Error");
        }
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      setError(error?.message || 'Something went wrong');
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center w-full max-w-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Account</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative">
          <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Name"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            required={true}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="text-gray-400 h-5 w-5" /> : <Eye className="text-gray-400 h-5 w-5" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
        >
          {loading ? 'Signing up...' : <><span>Sign Up</span><ArrowRight className="ml-2 h-5 w-5" /></>}
        </button>
      </form>
    </div>
  );
}