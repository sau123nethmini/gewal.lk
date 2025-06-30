import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {
  const [mode, setMode] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    // authentication/signup logic here
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${assets.login_img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(6px) brightness(0.95)',
        }}
        aria-hidden="true"
      />
      {/* Overlay to dim the background slightly */}
      <div className="absolute inset-0 bg-white/20 z-10" aria-hidden="true" />

      {/* Glassmorphism Form Card */}
      <div className="relative z-20 backdrop-blur-lg bg-white/50 rounded-2xl shadow-2xl px-8 sm:px-12 py-10 w-full max-w-md mx-4">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {mode === 'Login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mb-8 text-gray-500 text-center">
          {mode === 'Login'
            ? <>Not a member?{' '}
              <button
                type="button"
                className="text-purple-500 font-medium hover:underline"
                onClick={() => setMode('Sign Up')}
              >
                Create an account
              </button>
            </>
            : <>Already have an account?{' '}
              <button
                type="button"
                className="text-purple-500 font-medium hover:underline"
                onClick={() => setMode('Login')}
              >
                Sign in here
              </button>
            </>
          }
        </p>
        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-5 w-full">
          {mode === 'Sign Up' && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white/80"
                placeholder="Enter your full name"
              />
            </div>
          )}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white/80"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              autoComplete={mode === 'Login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white/80"
              placeholder="Enter your password"
            />
          </div>
          {mode === 'Login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-gray-300 bg-purple-500"
                />
                Remember me
              </label>
              <a href="#" className="text-purple-500 text-sm hover:underline font-medium">
                Forgot password?
              </a>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 mt-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded-lg transition"
          >
            {mode === 'Login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm font-medium">Or continue with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        {/* Social Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white/90 py-2.5 rounded-lg w-1/2 hover:bg-gray-50 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-gray-700">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white/90 py-2.5 rounded-lg w-1/2 hover:bg-gray-50 transition"
          >
            {/* Facebook SVG */}
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.676 0H1.326C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.919.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .593 23.406 0 22.676 0" />
            </svg>
            <span className="font-medium text-gray-700">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login