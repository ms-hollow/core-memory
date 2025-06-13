import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../apis/userApis";
import { createOrder } from "../../apis/orderApis";
import { getRegions, getCitiesByRegion } from "../../utils/LocationUtil";

interface OrderData {
    order_detail_id: number;
    full_name: string;
    full_address: string;
    contact_number: string;
}

const UserOrderDetails = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetailsIDs = location.state?.orderDetailsIDs || [];
    const orderIDs: number[] = [];

    const [regions, setRegions] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        unit: "",
        postal_code: "",
        city: "",
        region: "",
        contact_number: "",
    });

    // Redirect if order detail ID is missing
    useEffect(() => {
        if (orderDetailsIDs.length === 0) {
            alert("Missing order data. Redirecting...");
            navigate("/dashboard");
        }
    }, [orderDetailsIDs, navigate]);

    const userProfile = async () => {
        if (!token) {
            alert("Token is missing. Please log in again.");
            return;
        }

        try {
            const res = await getUserProfile(token);
            const user = res.data;

            //! Temporary, remove if na remove na ang timezone sa birth date
            const birthDate = "2025-04-08T00:00:00.000Z";
            const dateOnly = birthDate.split("T")[0];

            setFormData((prev) => ({
                ...prev,
                ...user,
                birth_date: dateOnly,
            }));

            const citiesList = getCitiesByRegion(user.region);
            setCities(citiesList);
        } catch {
            alert("An error occurred, please try again later.");
        }
    };

    useEffect(() => {
        userProfile();
    }, [token]);

    useEffect(() => {
        setRegions(getRegions());
    }, []);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = e.target.value;
        setFormData((prev) => ({
            ...prev,
            region: selectedRegion,
            city: "",
        }));
        setCities(getCitiesByRegion(selectedRegion));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            city: e.target.value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactNumChange = (value: string) => {
        setFormData((prev) => ({ ...prev, contact_number: value }));
    };

    const handleBack = () => {
        navigate("/dashboard");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            alert("Token is missing. Please log in again.");
            return;
        }

        try {
            const formattedData = {
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                full_address: [
                    formData.unit,
                    formData.address,
                    formData.city,
                    formData.region,
                    formData.postal_code,
                ]
                    .filter(Boolean)
                    .join(", ")
                    .trim(),
                contact_number: formData.contact_number,
            };

            const dataList: OrderData[] = orderDetailsIDs.map((id: number) => ({
                order_detail_id: id,
                full_name: formattedData.full_name,
                full_address: formattedData.full_address,
                contact_number: formattedData.contact_number,
            }));

            for (let data of dataList) {
                const res = await createOrder(data, token);
                orderIDs.push(res.data.order_id);
            }

            navigate("/checkout", { state: { orderDetailsIDs, orderIDs } });
        } catch {
            alert("An error occurred, please try again later.");
        }
    };

    return (
        <div className="default-background">
            <nav className="navbar">
                <div className="navbar__logo">
                    <a href="/dashboard" className="navbar__brand">
                        <span className="bold">CORE MEMORY</span>
                    </a>
                </div>
            </nav>

            <div className="orderDetails">
                <h1>Order Details</h1>

                <form className="orderDetails__form" onSubmit={handleSubmit}>
                    <div className="inputs">
                        <div className="groupInputs">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="unit"
                            placeholder="Apartment, Suite, etc. (Optional)"
                            value={formData.unit}
                            onChange={handleChange}
                        />

                        <div className="groupInputs">
                            <input
                                type="text"
                                name="postal_code"
                                placeholder="Postal Code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                required
                            />
                            <div className="order-detail-location-input">
                                <select
                                    name="region"
                                    className="order-detail-location-select"
                                    value={formData.region}
                                    onChange={handleRegionChange}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="order-detail-location-input">
                            <select
                                name="city"
                                className="order-detail-location-select"
                                value={formData.city}
                                onChange={handleCityChange}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <PhoneInput
                            placeholder="Phone number"
                            country="ph"
                            value={formData.contact_number}
                            onChange={handleContactNumChange}
                            inputProps={{ required: true }}
                            containerClass="contact-container"
                            inputClass="contactInputField"
                            buttonClass="contactInputButton"
                        />
                    </div>

                    <div className="orderDetails__buttons">
                        <button type="button" onClick={handleBack}>
                            Back to Home
                        </button>
                        <button type="submit" className="next">
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserOrderDetails;