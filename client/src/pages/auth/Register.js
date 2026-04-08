import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaDroplet, FaEye, FaEyeSlash, FaUser, FaHospital, FaHandHoldingMedical } from 'react-icons/fa6';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiArrowRight, HiArrowLeft , HiCheck } from 'react-icons/hi';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, requestEmailOtp, verifyEmailOtp, loading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const OTP_RESEND_COOLDOWN = 60;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    getValues
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const roles = [
    {
      id: 'user',
      title: 'Jeevo User',
      description: 'Donate or request blood whenever you need',
      icon: FaUser,
      color: 'primary'
    },
    {
      id: 'donor',
      title: 'Blood Donor',
      description: 'Register to donate blood and save lives',
      icon: FaDroplet,
      color: 'secondary'
    },
    {
      id: 'receiver',
      title: 'Blood Receiver',
      description: 'Request blood when you or someone needs it',
      icon: FaHandHoldingMedical,
      color: 'primary'
    },
    {
      id: 'hospital',
      title: 'Hospital/Blood Bank',
      description: 'Manage blood inventory and requests',
      icon: FaHospital,
      color: 'blue'
    }
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setOtpToken(null);
    setOtpEmail('');
    setResendCountdown(0);
    setStep(2);
  };

  const handleRequestOtp = async () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
    if (selectedRole === 'donor') {
      fieldsToValidate.push('bloodGroup');
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    const emailValue = getValues('email');
    setOtpEmail(emailValue);
    setOtpSending(true);
    const result = await requestEmailOtp(emailValue);
    setOtpSending(false);

    if (result?.success) {
      setResendCountdown(OTP_RESEND_COOLDOWN);
      setStep(3);
    }
  };

  const handleVerifyOtp = async (data) => {
    const emailValue = getValues('email');
    setOtpVerifying(true);
    const result = await verifyEmailOtp(emailValue, data.otp);
    setOtpVerifying(false);

    if (result?.success && result?.otpToken) {
      setOtpToken(result.otpToken);
      setStep(4);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || otpSending) return;
    const emailValue = getValues('email');
    setOtpSending(true);
    const result = await requestEmailOtp(emailValue);
    setOtpSending(false);
    if (result?.success) {
      setResendCountdown(OTP_RESEND_COOLDOWN);
    }
  };

  const onSubmit = async (data) => {
    if (!otpToken) {
      toast.error('Please verify your email before creating a password.');
      setStep(3);
      return;
    }

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: selectedRole,
      otpToken,
      ...(selectedRole === 'donor' && { bloodGroup: data.bloodGroup })
    };

    const result = await registerUser(userData);
    if (result?.success) {
      const dashboardPaths = {
        user: '/receiver/dashboard',
        donor: '/donor/dashboard',
        receiver: '/receiver/dashboard',
        hospital: '/hospital/dashboard'
      };
      navigate(dashboardPaths[selectedRole] || '/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <span className="text-2xl font-bold bg-clip-text text-transparent">
              jeevo
            </span>
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-colors ${
                        step > s ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Role</span>
              <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Info</span>
              <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Verify</span>
              <span className={step >= 4 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Security</span>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
              <p className="text-gray-600 mb-6">Select how you want to use Jeevo</p>

              <div className="space-y-4">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        role.color === 'primary' ? 'bg-primary-100' :
                        role.color === 'secondary' ? 'bg-secondary-100' : 'bg-blue-100'
                      }`}>
                        <role.icon className={`h-6 w-6 ${
                          role.color === 'primary' ? 'text-primary-600' :
                          role.color === 'secondary' ? 'text-secondary-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{role.title}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="mt-6 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => {
                  setOtpToken(null);
                  setOtpEmail('');
                  setResendCountdown(0);
                  setStep(1);
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <HiArrowLeft className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
              <p className="text-gray-600 mb-6">Tell us about yourself</p>

              <form className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className={`input pl-11 ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="last name / surname"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`input pl-11 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="mygmail@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[+]?[\d\s-]{10,}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className={`input pl-11 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+91 1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Blood Type for Donors */}
                {selectedRole === 'donor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypes.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            watch('bloodGroup') === type
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={type}
                            {...register('bloodGroup', { required: selectedRole === 'donor' ? 'Blood type is required' : false })}
                            className="sr-only"
                          />
                          <span className="font-semibold">{type}</span>
                        </label>
                      ))}
                    </div>
                    {errors.bloodGroup && (
                      <p className="mt-1 text-sm text-red-600">{errors.bloodGroup.message}</p>
                    )}
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpSending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-6"
                >
                  {otpSending ? 'Sending Code...' : 'Continue'}
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Step 3: Email Verification */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => {
                  setOtpToken(null);
                  setStep(2);
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <HiArrowLeft className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
              <p className="text-gray-600 mb-6">
                Enter the 6-digit code we sent to {otpEmail || 'your email'}.
              </p>

              <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      {...register('otp', {
                        required: 'Verification code is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Enter a valid 6-digit code'
                        }
                      })}
                      className={`input pl-11 ${errors.otp ? 'border-red-500' : ''}`}
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={otpVerifying}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-6"
                >
                  {otpVerifying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify Email
                      <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                <div className="text-center text-sm text-gray-600">
                  {resendCountdown > 0 ? (
                    <span>Resend code in {resendCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 4: Password */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setStep(3)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <HiArrowLeft className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Password</h1>
              <p className="text-gray-600 mb-6">Secure your account with a strong password</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must include uppercase, lowercase, and number'
                        }
                      })}
                      className={`input pl-11 pr-11 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        <div className={`flex-1 h-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                        <div className={`flex-1 h-1 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                        <div className={`flex-1 h-1 rounded ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                        <div className={`flex-1 h-1 rounded ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use 8+ characters with uppercase, lowercase, and numbers
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      className={`input pl-11 pr-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('terms', { required: 'You must accept the terms' })}
                    className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms.message}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 bg-black items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.08), transparent 45%)"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-white max-w-lg w-full"
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl mb-3 font-semibold tracking-[0.3em] uppercase">
              JEEVO
            </h1>
            <p className="text-gray-300 text-lg mb-2">
              Locate. Donate. Celeberate.
            </p>
            <p className="text-gray-400 text-sm mt-2 mb-10">
              Register once to unlock verified donor access, hospital coordination, and real-time alerts when every second counts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <HiCheck className="text-white" />
              </div>
              <div>
                <p className="text-gray-100 font-semibold">Choose your role</p>
                <p className="text-gray-400 text-sm">Donor, receiver, hospital, or general user.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <HiCheck className="text-white" />
              </div>
              <div>
                <p className="text-gray-100 font-semibold">Verify your email</p>
                <p className="text-gray-400 text-sm">Secure your account and prevent misuse.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <HiCheck className="text-white" />
              </div>
              <div>
                <p className="text-gray-100 font-semibold">Share key details</p>
                <p className="text-gray-400 text-sm">Availability and blood group help faster matching.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <HiCheck className="text-white" />
              </div>
              <div>
                <p className="text-gray-100 font-semibold">Start coordinating</p>
                <p className="text-gray-400 text-sm">Get notified the moment a match appears.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-300">
            <div className="border border-white/20 rounded-lg py-3">Private by default</div>
            <div className="border border-white/20 rounded-lg py-3">Verified network</div>
            <div className="border border-white/20 rounded-lg py-3">2-minute setup</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
