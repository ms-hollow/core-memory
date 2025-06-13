import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import OrderDetails from "./OrderDetailsModal";
import ShippingInformationModal from "./ShippingInformationModal";
import { Order } from "../../types/orderTypes";

interface OrderCardProps {
    order_data: Order;
}

const statusInfo = {
    "Order Placed": {
        icon: "/icons/orders.svg",
        message: "Please give us 5 to 7 days to process your order.",
    },
    "In-Transit": {
        icon: "/icons/in-transit.svg",
        message: "Your parcel has been picked up by the courier.",
    },
    "Delivered": {
        icon: "/icons/completed.svg",
        message: "Your package has been delivered.",
    },
};

const OrderCard: React.FC<OrderCardProps> = ({ order_data }) => {
    const [isOrderDetailsModalOpen, setOrderDetailsModal] = useState(false);
    const [isShippingInfoModalOpen, setShippingInfoModal] = useState(false);

    const currentStatusInfo = statusInfo[
        order_data.status as keyof typeof statusInfo
    ] || {
        icon: "",
        message: "Unknown status",
    };

    return (
        <div className="order-card">
            {/* Header */}
            <div
                className="order-card__header"
                onClick={() => setShippingInfoModal(true)}
            >
                <div className="order-details">
                    <img
                        src={currentStatusInfo.icon}
                        className="order-icon"
                        alt="Order-icon"
                    />
                    <div className="info">
                        <div className="header">{order_data.status}</div>
                        <div className="sub-header">
                            {currentStatusInfo.message}
                        </div>
                    </div>
                </div>
                <MdArrowForwardIos className="forward-icon" />
            </div>

            {/* Product Details */}
            <div
                className="product-container"
                onClick={() => setOrderDetailsModal(true)}
            >
                <div className="product-desc">
                    <img
                        src={
                            order_data.item_orders.product_image ||
                            "/images/default-product.png"
                        }
                        className="product-desc__product-image"
                        alt="Product"
                    />
                    <div className="product-desc__product-info">
                        <h3>{order_data.item_orders.product_name}</h3>
                        <h4>
                            Variant:{" "}
                            <span>{order_data.item_orders.variant}</span>
                        </h4>
                        <h2>₱ {order_data.item_orders.product_price}</h2>
                    </div>
                </div>
                <div className="qty-total-holder">
                    <div className="product-qty">
                        Qty: {order_data.item_orders.quantity}
                    </div>
                    <h2 className="order-total">
                        Total: ₱ {order_data.total_amount}
                    </h2>
                </div>
            </div>

            {/* Modals */}
            {isOrderDetailsModalOpen && (
                <OrderDetails
                    isOpen={isOrderDetailsModalOpen}
                    setOrderDetailsModal={setOrderDetailsModal}
                    setShippingInfoModal={setShippingInfoModal}
                    order_data={order_data}
                />
            )}

            {isShippingInfoModalOpen && (
                <ShippingInformationModal
                    isOpen={isShippingInfoModalOpen}
                    setShippingInfoModal={setShippingInfoModal}
                    setOrderDetailsModal={setOrderDetailsModal}
                    order_data={order_data}
                />
            )}
        </div>
    );
};

export default OrderCard;
