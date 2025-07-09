import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (currentState === 'Sign up') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePic) formData.append('profilePic', profilePic);

        const response = await axios.post(`${backendUrl}/api/user/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Registration successful! You are now logged in.');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
    setSubmitting(false);
  };

  // Handler for toggling between Login and Sign Up
  const handleToggle = (state) => {
    setCurrentState(state);
    setName('');
    setPassword('');
    setEmail('');
    setProfilePic(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-poppins px-2">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left: Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-8 bg-gradient-to-br from-[#f1e5fc] to-[#c7aefd]">
          <img
            src="https://cdn.dribbble.com/users/214929/screenshots/14110227/media/9d2d9d0a9bcf2ec3c5c0b8f7ffdbb9e8.png"
            alt="Login illustration"
            className="max-w-xs w-full h-auto"
            draggable="false"
            style={{ borderRadius: "1.5rem" }}
          />
        </div>
        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-6 md:px-12">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold text-[#7d3ae8] mb-1">Welcome!</h2>
            <p className="text-[#a084e8] text-base">
              {currentState === 'Login' ? 'Sign in to your Account' : 'Create your Account'}
            </p>
          </div>
          <form onSubmit={onsubmitHandler} className="flex flex-col gap-4">
            {currentState === 'Sign up' && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <label className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-[#b8a1e6] cursor-pointer overflow-hidden bg-[#f1e5fc] hover:bg-[#ecd9fc] transition">
                    {preview ? (
                      <img src={preview} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-[#a084e8]">Upload</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-[#a084e8] opacity-80">Upload profile picture</span>
                </div>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-3 rounded-lg border border-[#e3d6f6] bg-[#f7f3fd] text-black focus:border-[#a084e8] focus:ring-2 focus:ring-[#ecd9fc] outline-none transition"
                  type="text"
                  placeholder="Name"
                  required
                  autoComplete="name"
                />
              </>
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-3 rounded-lg border border-[#e3d6f6] bg-[#f7f3fd] text-black focus:border-[#a084e8] focus:ring-2 focus:ring-[#ecd9fc] outline-none transition"
              type="email"
              placeholder="Email Address"
              required
              autoComplete="email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-[#e3d6f6] bg-[#f7f3fd] text-black focus:border-[#a084e8] focus:ring-2 focus:ring-[#ecd9fc] outline-none transition"
              type="password"
              placeholder="Password"
              required
              autoComplete={currentState === 'Sign up' ? "new-password" : "current-password"}
            />
            <div className="flex items-center justify-between text-sm text-[#a084e8] mt-0">
              <button
                type="button"
                className="hover:underline"
                tabIndex={-1}
                onClick={() => alert("Forgot password coming soon!")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                className={`flex-1 py-2 rounded-full font-bold text-white shadow transition ${
                  currentState === 'Login'
                    ? 'bg-[#7d3ae8] hover:bg-[#a084e8]'
                    : 'bg-[#e3d6f6] text-[#7d3ae8] hover:bg-[#d1b3fd]'
                }`}
                disabled={submitting}
              >
                {currentState === 'Login'
                  ? (submitting ? 'Signing in...' : 'SIGN IN')
                  : (submitting ? 'Signing up...' : 'SIGN UP')}
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-full border-2 font-bold transition ${
                  currentState === 'Login'
                    ? 'border-[#e3d6f6] text-[#7d3ae8] hover:bg-[#f7f3fd]'
                    : 'border-[#7d3ae8] text-[#7d3ae8] hover:bg-[#f7f3fd]'
                }`}
                onClick={() => handleToggle(currentState === 'Login' ? 'Sign up' : 'Login')}
              >
                {currentState === 'Login' ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
          </form>
          <div className="mt-6 flex flex-col gap-3 items-center">
            <span className="text-xs text-[#b9a5de]">OR LOGIN WITH</span>
            <div className="flex gap-4 mt-1">
              <button type="button" className="bg-white border border-[#e3d6f6] rounded-full w-10 h-10 flex items-center justify-center shadow hover:border-[#7d3ae8] transition" tabIndex={-1}>
                <FaFacebookF className="text-[#7d3ae8] text-lg" />
              </button>
              <button type="button" className="bg-white border border-[#e3d6f6] rounded-full w-10 h-10 flex items-center justify-center shadow hover:border-[#7d3ae8] transition" tabIndex={-1}>
                <FaGoogle className="text-[#e94435] text-lg" />
              </button>
              <button type="button" className="bg-white border border-[#e3d6f6] rounded-full w-10 h-10 flex items-center justify-center shadow hover:border-[#7d3ae8] transition" tabIndex={-1}>
                <FaLinkedinIn className="text-[#0077B5] text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;