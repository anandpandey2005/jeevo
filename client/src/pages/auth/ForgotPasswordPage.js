import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { FaEnvelope, FaRegEnvelope, FaMailBulk } from 'react-icons/fa';
import { FaE } from 'react-icons/fa6';
const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to send reset link';
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-semibold tracking-[0.3em] uppercase text-gray-900 hover:opacity-80 transition-opacity">
            JEEVO
          </Link>
        </div>

        <div className="glass-card p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl"><FaEnvelope></FaEnvelope></span>
                </div>
                
    
                <h1 className="text-2xl font-bold text-gray-800">Forgot your password?</h1>
                <p className="text-gray-600 mt-2">
                  Enter your email and we will send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address'
                      }
                    })}
                    className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="name@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">&#9989;</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We have sent a password reset link. Please check your inbox and spam folder.
              </p>
              <Link to="/login" className="btn-primary w-full block text-center py-3 rounded-xl font-semibold">
                Back to Login
              </Link>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-gray-500 hover:text-primary-600 font-medium inline-flex items-center transition-colors"
            >
              <span className="mr-2">&larr;</span>
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
