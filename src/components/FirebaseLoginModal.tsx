import React, { useState, useEffect, useRef } from 'react';
import { sendOTP, verifyOTP, User } from '../firebase/auth';

interface FirebaseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const FirebaseLoginModal: React.FC<FirebaseLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp('');
      setError('');
      setMessage('');
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendOTP(phone, 'recaptcha-container');
      setMessage('OTP sent successfully!');
      setStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await verifyOTP(otp);
      setMessage('Login successful!');
      onLoginSuccess(user);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendOTP(phone, 'recaptcha-container');
      setMessage('OTP resent successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-pink-600 flex-1">
            Login to ShopEasy
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold ml-4"
          >
            ×
          </button>
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaRef}></div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {step === 'phone' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your phone number"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-pink-500 focus:border-pink-500 text-sm border border-gray-300"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-center text-lg tracking-widest"
                maxLength={6}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                OTP sent to +91 {phone}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full text-pink-600 hover:text-pink-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>

              <button
                onClick={() => setStep('phone')}
                disabled={loading}
                className="w-full text-gray-600 hover:text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Phone Number
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseLoginModal;
