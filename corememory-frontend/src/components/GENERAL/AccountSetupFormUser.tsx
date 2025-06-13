import { useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import * as userApis from "../../apis/userApis";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const AccountSetupFormUser = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signupFormData = location.state.formData;

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        address: "",
        city: "",
        region: "",
        postal_code: "",
        contactNum: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactNumChange = (value: string, data: {} | CountryData) => {
        setFormData((prev) => ({
            ...prev,
            contact_number: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const combinedData = { ...signupFormData, ...formData };
        const response = await userApis.registerUser(combinedData);

        if (response.status_code === 201) {
            toast.success("Account successfully created!");
            login(response.token);
            navigate("/dashboard");
        }
    };

    return (
        <>
            <div className="formComponent" onSubmit={handleSubmit}>
                <div className="formComponent__form-container">
                    <div className="formComponent__header">
                        <h1> Complete Your Profile </h1>
                        <p>
                            {" "}
                            Help us get to know you by filling in a few details.{" "}
                        </p>
                    </div>

                    <form className="formComponent__form">
                        <div className="inputGroup">
                            <div className="label-input">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Ex. John"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="label-input">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Joe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="label-input">
                            <label htmlFor="birth_date">Birthdate</label>
                            <input
                                type="date"
                                name="birth_date"
                                placeholder="MM/DD/YYYY"
                                value={formData.birth_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="label-input">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Ex. 123 Main St., New York, NY 10001"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputGroup">
                            <div className="label-input">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="label-input">
                                <label htmlFor="region">Region</label>
                                <input
                                    type="text"
                                    name="region"
                                    placeholder="Region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="inputGroup">
                            <div className="label-input">
                                <label htmlFor="postal_code">Postal Code</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    placeholder="Ex. 1100"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="label-input">
                                <label htmlFor="contactNum">
                                    Contact Number
                                </label>
                                {/* <input 
                  type="text" 
                  name="contactNum"
                  placeholder="Ex. +639123456789"
                  value={formData.contactNum}
                  onChange={handleChange}
                  required
                /> */}

                                <PhoneInput
                                    placeholder="Phone number"
                                    country={"ph"}
                                    value={formData.contactNum}
                                    onChange={handleContactNumChange}
                                    inputProps={{
                                        required: true,
                                    }}
                                    inputClass="contactNumInputField"
                                    buttonClass="contactNumInputButton"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="formComponent__submit-button"
                        >
                            Save & Continue
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccountSetupFormUser;
