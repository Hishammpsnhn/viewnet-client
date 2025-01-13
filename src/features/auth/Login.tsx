import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useLoginValidator } from "../../hooks/useValidate";
import { loginUser, verifyOtp } from "../../reducers/authReducers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.ts";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { QRSave_API, QRValidate_API } from "../../api/user/qrLogin.ts";

interface LoginModalProps {
  login: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ login }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(login);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [random, setRandom] = useState<string | null>(null);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    setIsOpen(login);
  }, [login]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    const validate = useLoginValidator({ email });
    validate;

    if (validate) {
      setEmailError(validate);
    } else {
      const resultAction = await dispatch(loginUser(email));

      if (resultAction.payload) {
        setOtpVisible(true);
      } else {
        toast.error("something went wrong");
      }
    }
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

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await dispatch(verifyOtp({ otp: otp.join(""), email }));
      if (res.payload.user) {
        setOtpVisible(false);
        ("Login successful");
        if (
          res.payload.user.defaultProfile &&
          res.payload.user.profiles.length
        ) {
          navigate("/");
        } else {
          navigate(`/profile/${res.payload.user?._id}`);
        }
        closeModal();
      } else {
        ("OTP verification failed");
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    //setOtpVisible(false); // Reset OTP visibility when closing the modal
  };

  useEffect(() => {
    if (isOpen && !otpVisible) {
      const randomNumber = Math.floor(Math.random() * 1000000).toString();
      console.log("random number: ", randomNumber);
      setRandom(randomNumber);
      QRSave_API(randomNumber);
  
      const validateQRCode = async () => {
        console.log("Checking QR...");
        const data = await QRValidate_API(randomNumber); 
        console.log(data);
        if (data.message === "validated") {
          clearInterval(intervalId);
          console.log("Validation complete. Interval stopped.");
        }
      };
  
      const intervalId = setInterval(validateQRCode, 7000);
  
      return () => clearInterval(intervalId);
    }
  }, [isOpen, otpVisible]); 
  


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black px-20 py-12 rounded-lg relative">
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

            {!otpVisible ? (
              <div className="flex items-center justify-between mb-4">
                <div className="flex justify-center flex-1">
                  <div className="text-center">
                    <QRCodeSVG
                      value={`http://localhost:4000/api/user/qr-scan${random}`}
                      size={150}
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

                <div className="border-l-2 border-gray-600 h-60 mx-4"></div>

                <form
                  noValidate
                  className="flex flex-col items-start flex-1 gap-4 text-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`p-3 text-md border ${
                      emailError ? "border-red-500" : "border-secondary"
                    } bg-black rounded-md w-full`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                  <p className="text-gray-600 text-[10px]">
                    By proceeding you confirm that you are above 18 years of age
                    and agree to the Privacy Policy & Terms of Use
                  </p>
                  <button
                    type="submit"
                    className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
                  >
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="w-full text-start text-sm text-gray-400">
                  Enter OTP sent to demo@gmail.com
                </p>
                <form onSubmit={handleOtpSubmit}>
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
                    type="submit"
                    className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
                  >
                    Verify OTP
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
