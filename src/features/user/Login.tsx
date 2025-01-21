import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { otpValidator, useLoginValidator } from "../../hooks/useValidate.ts";
import { getME, loginUser, verifyOtp } from "../../reducers/userReducer/userThunks.ts";
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
  const [validateOtp, setValidateOtp] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);

  useEffect(() => {
    setIsOpen(login);
  }, [login]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    const validate = useLoginValidator({ email });

    if (validate) {
      setEmailError(validate);
    } else {
      const resultAction = await dispatch(loginUser(email));

      if (resultAction.payload) {
        setOtpVisible(true);
        setResendCountdown(29);
      }
    }
  };

  const handleResendOtp = async () => {
    setEmailError(null);
    setValidateOtp(null);
    setOtp(new Array(4).fill(""));

    const validate = useLoginValidator({ email });

    if (validate) {
      setEmailError(validate);
    } else {
      const resultAction = await dispatch(loginUser(email));

      if (resultAction.payload) {
        setResendCountdown(29);
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
    if (value === "" && index === 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (/[^0-9]/.test(value)) {
      return;
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidateOtp(null);
    const validation = otpValidator(otp);
    if (validation) {
      setValidateOtp(validation);
      return;
    }
    try {
      const res = await dispatch(verifyOtp({ otp: otp.join(""), email }));
      if (res.payload.user) {
        setOtpVisible(false);
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
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };
  const handleOtpBackspace = (index: number) => {
    if (index === otp.length - 1 && otp[index] != "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    if (index) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      otpRefs.current[index - 1]?.focus();
    } else {
      console.log("No input is focused.");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setOtpVisible(false);
    setEmail("");
    setEmailError(null);
    setRandom(null);
    setValidateOtp(null);
    setOtp(new Array(4).fill(""));
  };

  useEffect(() => {
    if (isOpen && !otpVisible) {
      const randomNumber = Math.floor(Math.random() * 1000000).toString();
      setRandom(randomNumber);
      QRSave_API(randomNumber);
      console.log(`http://172.16.1.83:5173/?token=${randomNumber}`);

      const validateQRCode = async () => {
        ("Checking QR...");
        const data = await QRValidate_API(randomNumber);
        data;
        if (data.success) {
          clearInterval(intervalId);
          closeModal();
          toast.success("Successfully logged in", {
            theme: "dark",
          });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          dispatch(getME());
          console.log("Validation complete. Interval stopped.");
        }
      };

      const intervalId = setInterval(validateQRCode, 7000);

      return () => clearInterval(intervalId);
    }
  }, [isOpen, otpVisible]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-black px-6 py-8 sm:px-12 sm:py-10 md:px-8 md:py-8 rounded-lg relative w-full max-w-2xl">
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
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex justify-center flex-1 mb-4 md:mb-0">
                  <div className="text-center">
                    <QRCodeSVG
                      value={`http://172.16.1.83:5173/?token=${random}`}
                      size={150}
                    />
                    <h6 className="font-semibold text-gray-100 p-1">
                      Use Camera To Scan
                    </h6>
                    <p className="text-gray-600 text-[10px]">
                      Click on the link generated <br /> to redirect to View Net
                      mobile app
                    </p>
                  </div>
                </div>

                <div className="border-l-2 border-gray-600 h-60 mx-4 md:mx-6 hidden md:block"></div>

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
              <div className="flex flex-col items-center gap-1 text-center bg-black w-2/4 mx-auto">
                <p className="w-full  text-sm text-gray-400">
                  Enter OTP sent to demo@gmail.com
                </p>
                {validateOtp && <p className="text-red-800">{validateOtp}</p>}
                <form onSubmit={handleOtpSubmit}>
                  <div className="flex gap-2 my-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={digit}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") handleOtpBackspace(index);
                        }}
                        onChange={(e) => handleOtpChange(e, index)}
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg border border-secondary bg-black rounded-md"
                        ref={(el) => (otpRefs.current[index] = el)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  {!resendCountdown ? (
                    <button type="button" onClick={handleResendOtp}>Resend OTP</button>
                  ) : (
                    <p className="w-full text-start text-sm text-gray-400">
                      Resend OTP in 00:{resendCountdown}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
                  >
                    {" "}
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
