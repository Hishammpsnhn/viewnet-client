import React, { useState, useEffect, useRef } from "react";

interface LoginModalProps {
  login: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ login }) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(login);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsOpen(login);
  }, [login]);

  const handleSubmit = () => {
    alert(`Email submitted: ${email}`);
    setOtpVisible(true);
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    alert(`OTP submitted: ${otp.join("")}`);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOtpVisible(false); // Reset OTP visibility when closing the modal
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black px-20 py-12 rounded-lg relative">
            {/* Close Button in the top-right corner */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-700"
            >
              X
            </button>

            <div className="flex justify-center items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Login or signup to continue
              </h2>
            </div>

            {/* Conditionally render either email input or OTP input */}
            {!otpVisible ? (
              <div className="flex items-center justify-between mb-4">
                {/* Left side (QR code) */}
                <div className="flex justify-center flex-1">
                  <div className="text-center">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="QR Code"
                      className="w-36 h-36 object-cover m-auto"
                    />
                    <h6 className="font-semibold text-gray-100 p-1">
                      Use Camera To Scan
                    </h6>
                    <p className="text-gray-600 text-[10px]">
                      Click on the link generated <br /> to redirect to Tiny
                      Moviez mobile app
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="border-l-2 border-gray-600 h-60 mx-4"></div>

                {/* Right side (email input and submit button) */}
                <div className="flex flex-col items-start flex-1 gap-4 text-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="p-3 text-md border border-secondary bg-black rounded-md w-full"
                  />
                  <p className="text-gray-600 text-[10px]">
                    By proceeding you confirm that you are above 18 years of age
                    and agree to the Privacy Policy & Terms of Use
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="w-full text-start text-sm text-gray-400">
                  Enter OTP sent to demo@gmail.com
                </p>
                {/* OTP Fields (4 separate inputs) */}
                <div className="flex gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg border border-secondary bg-black rounded-md"
                      ref={(el) => (otpRefs.current[index] = el)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <p className="w-full text-start text-sm text-gray-400">
                  Resend OTP in 00:26
                </p>
                <button
                  onClick={handleOtpSubmit}
                  className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
