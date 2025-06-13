import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const ForgotPasswordForm = () => {

    const [emailAdd, setEmailAdd] = useState({
        emailAddress: "",
    });

    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmailAdd((prev) => ({ ...prev, [name]: value }));
    };

    const handleBack = ()  => {
        navigate("/");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(emailAdd);

        navigate("/verify-account");
    };

    return (
      <>
        <div className="forgotPassword" onSubmit={handleSubmit}>
            <div className="forgotPassword__component">
                <div className="componentHeader">
                    <button onClick={handleBack}><FaArrowLeftLong /></button>
                    <h1> Forgot Password </h1>
                </div>

                <form className="componentForm">
                    <div className="label-input">
                        <label htmlFor="emailAddress"> Enter Email Address </label>
                        <input 
                            type="email"
                            name="emailAddress"
                            placeholder="Ex. someone@example.com"
                            value={emailAdd.emailAddress}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <button type="submit"> Send </button>
                </form>
            </div>
        </div>
      </>
    );
  };
  
  export default ForgotPasswordForm;