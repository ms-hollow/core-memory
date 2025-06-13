import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { RiEyeCloseLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState({
        newPassword: "",
        confirmedPassword: ""
    });
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [conPasswordVisible, setConPasswordVisible] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConPasswordVisibility = () => {
        setConPasswordVisible(!conPasswordVisible);
    };

    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(password.newPassword === password.confirmedPassword){
            navigate("/login");
        }
        else {
            window.alert("Password do not match.")
        }
    };

    return (
        <div className="forgotPassword" onSubmit={handleSubmit}>
            <div className="forgotPassword__component">
                <div className="componentHeader">
                    <h1> New Password </h1>
                </div>

                <form className="componentForm">
                    <div className="label-input">
                        <label htmlFor="newPassword"> New Password </label>
                        <div>
                            <input 
                                type={newPasswordVisible ? "text" : "password"}
                                name="newPassword"
                                placeholder="Enter your new password"
                                value={password.newPassword}
                                onChange={handleChange}
                                required 
                            />
                            {newPasswordVisible ? (
                                <RiEyeLine
                                onClick={toggleNewPasswordVisibility}
                                />
                            ) : (
                                <RiEyeCloseLine
                                onClick={toggleNewPasswordVisibility}
                                />
                            )}
                        </div>
                    </div>

                    <div className="label-input">
                        <label htmlFor="confirmPassword"> Confirm Password </label>
                        <div>
                            <input 
                                type={conPasswordVisible ? "text" : "password"}
                                name="confirmedPassword"
                                placeholder="Confirm your new password"
                                value={password.confirmedPassword}
                                onChange={handleChange}
                                required 
                            />
                            {conPasswordVisible ? (
                                <RiEyeLine
                                onClick={toggleConPasswordVisibility}
                                />
                            ) : (
                                <RiEyeCloseLine
                                onClick={toggleConPasswordVisibility}
                                />
                            )}
                        </div>
                    </div>

                    <button type="submit"> Submit </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordForm;