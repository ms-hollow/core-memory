import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const VerificationForm = () => {

    const [otp, setOtp] = useState<string[]>(Array(4).fill(""));

    const navigate = useNavigate();
    const inputRefs = useRef<HTMLInputElement[]>([]); 

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleBack = ()  => {
        navigate("/forgot-password");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        console.log("Entered OTP:", otpCode);
        navigate("/reset-password");
    };

    const handleResend = ()  => {
        
    };

    return (
        <div className="forgotPassword" onSubmit={handleSubmit}>
            <div className="forgotPassword__component">
                <div className="componentHeader">
                    <button onClick={handleBack}><FaArrowLeftLong /></button>
                    <h1> Verification </h1>
                </div>

                <form className="componentForm">
                    <span className="enterCode">Enter Verification Code</span>

                    <div className="inputBox">
                        {otp.map((digit, index) => (
                            <input 
                                key={index}
                                ref={(el) => {if (el) inputRefs.current[index] = el;}}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit} 
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                required 
                            />
                        ))}
                    </div>
                    <button type="submit"> Verify </button>
                </form>

                <span className="resend">Didn't receive a code? <button onClick={handleResend}>Resend</button> </span>
            </div>
        </div>
    )
}

export default VerificationForm;