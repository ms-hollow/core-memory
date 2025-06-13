import { useState, useEffect } from "react";
import UserHeader from "../../components/USERS/UserHeader";
import StarRating from "../../components/ui/StarRating";
import CreateCoreMemory from "../../components/ui/CreateCoreMemory";
import { useAuth } from "../../context/AuthContext";
import { getProduct } from "../../apis/productApis";
import { Product } from "../../types/orderTypes";

const colors = {
    yellow: "#E5C006",
    red: "#D20404",
    green: "#84D632",
    blue: "#2B65FB",
    purple: "#A500DF",
};

const UserDashboard: React.FC = () => {
    const { token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState<Product[]>([]);

    const rating = 4.5; //* Hindi pa connected sa Rating Table

    const fetchProducts = async () => {
        try {
            if (token) {
                const res = await getProduct(token);
                setProduct(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const handleCreateButton = () => {
        setShowModal(true);
    };

    return (
        <div className="default-background">
            <UserHeader />
            <div className="product-card">
                <img
                    src="/images/product-placeholder.png"
                    className="product-card__image"
                    alt="Product"
                />
                <div className="product-card__info">
                    <h2 className="title">{product[0]?.product_name}</h2>
                    <div className="rating">
                        <StarRating rating={rating} />
                    </div>
                    <div className="description-container">
                        <p className="description">{product[0]?.description}</p>
                    </div>

                    <div className="variant-title">Variant</div>
                    <div className="variant-options">
                        {Object.entries(colors).map(([name, hex]) => (
                            <div className="variant" key={name}>
                                <div
                                    className="circle"
                                    style={{ background: hex }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <button className="cta-button" onClick={handleCreateButton}>
                        <span className="cta-button__text">
                            Create a Core Memory
                        </span>
                    </button>
                </div>
            </div>

            <CreateCoreMemory isOpen={showModal} setShowModal={setShowModal} />
        </div>
    );
};

export default UserDashboard;
