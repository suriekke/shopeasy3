import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestOtp: (phone: string) => Promise<void>;
  onVerifyOtp: (phone: string, otp: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onRequestOtp, onVerifyOtp }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    try {
      await onRequestOtp(phone);
      setStep("otp");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onVerifyOtp(phone, otp);
      if (success) {
        // Login successful - modal will be closed by parent component
        // Don't reset form or change step here
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
  };

  // Reset form when modal is closed
  const handleClose = () => {
    setPhone("");
    setOtp("");
    setStep("phone");
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* reCAPTCHA container for Firebase */}
      <div id="recaptcha-container"></div>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-pink-600 flex-1">
            Login to ShopEasy
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {step === "phone" && (
          <>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={10}
            />
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-xl hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                OTP sent to {phone}
              </p>
              <button
                onClick={handleBackToPhone}
                className="text-pink-600 text-sm hover:text-pink-700 underline"
              >
                Change number
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={6}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-xl hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

