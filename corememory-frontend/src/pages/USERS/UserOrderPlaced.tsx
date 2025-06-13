import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderDetailById } from "../../apis/order-detailApis";
import { getOrderById } from "../../apis/orderApis";

const OrderPlaced = () => {
    const { token } = useAuth();
    const [orderDetails, setOrderDetails] = useState<any[] | null>(null);
    const [ordersData, setOrdersData] = useState<any[] | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetailsIDs, orderIDs } = location.state as {
        orderDetailsIDs: number[];
        orderIDs: number[];
    };

    const subTotal = orderDetails?.reduce(
        (acc, order) => acc + (order.price_at_purchase || 0), 
        0
    ) || 0;
    const shippingFee = ordersData?.[0]?.shipping_fee || 0;
    let total = ordersData?.reduce(
        (acc, order) => acc + (order.total_amount || 0), 
        0
    ) || 0;
    total = total + shippingFee;
    const vat = ordersData?.reduce(
        (acc, order) => acc + (order.vat || 0), 
        0
    ) || 0;

    useEffect(() => {
        if (!orderDetailsIDs || orderDetailsIDs.length === 0) {
            alert("Missing checkout data. Redirecting...");
            navigate("/dashboard");
        }
    }, [orderDetailsIDs, navigate]);

    // Fetch order details and orders based on order detail IDs and order IDs respectively
    useEffect(() => {
        const fetchOrdersAndDetails = async () => {
            if (!token || !orderDetailsIDs || !orderIDs) return;

            try {
                const allDetails = await Promise.all(
                    orderDetailsIDs.map((id) => getOrderDetailById(id, token).then((res) => res.data))
                );
                setOrderDetails(allDetails);

                const allOrders = await Promise.all(
                    orderIDs.map((id) => getOrderById(id, token).then((res) => res.data))
                );
                setOrdersData(allOrders);
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };

        fetchOrdersAndDetails();
    }, [token, orderDetailsIDs, orderIDs]);

    const goToHome = () => {
        navigate("/dashboard");
    };

    const goToTrackOrder = () => {
        navigate("/order");
    };

    return (
        <div className="default-bg">
            <div className="order-placed-container">
                {/* <nav className="navbar">
                    <div className="navbar__logo">
                        <a href="/" className="navbar__brand">
                            <span className="bold">CORE MEMORY</span>
                        </a>
                    </div>
                </nav> */}

                <div className="order-placed-content">
                    <div className="order-placed-header">
                        <img
                            src="/images/order-confirmed.png"
                            className="order-placed-heading-img"
                        />
                        <div className="order-placed-heading-text">
                            <div>ORDER</div>
                            <div>CONFIRMED</div>
                        </div>
                    </div>

                    <div className="order-placed-items">
                        <div className="order-placed-message">
                            <div className="order-placed-message-heading">
                                Thank you for shopping with us!
                            </div>
                            <div className="order-placed-processing-message">
                                Please allow 5 to 7 days for processing. We
                                appreciate your patience!
                            </div>
                        </div>

                        <div className="order-placed-id">
                            <div className="order-placed-text">Order ID</div>

                            <div className="order-placed-id-wrapper">
                                <div className="order-placed-id-text">
                                    {ordersData?.[0]?.order_reference_id}
                                </div>
                                <img
                                    src="/icons/copy-icon.svg"
                                    alt="Copy"
                                    className="order-placed-copy-icon"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="order-placed-broken-line" />

                    {orderDetails?.map((order) => {
                        return (
                            <div key={order.order_detail_id} className="order-placed-product">
                                <img
                                    src="/images/default-product.png"
                                    alt="Product"
                                    className="order-placed-product-image"
                                />
                                <div className="order-placed-info-wrapper">
                                    <div className="order-placed-product-info">
                                        <div className="order-placed-product-name">
                                            Core Memory Globe
                                        </div>
                                        <div className="order-placed-product-varqty">
                                            Variant: {order.variant}
                                        </div>
                                        <div className="order-placed-product-varqty">
                                            Quantity: {order.quantity}
                                        </div>
                                    </div>
                                    <div className="order-placed-prod-total">
                                        ₱ {order.price_at_purchase.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <hr className="order-placed-solid-line" />

                    <div className="order-placed-total-price">
                        <div className="order-placed-total-wrapper">
                            <div className="order-placed-misc">SubTotal</div>
                            <div className="order-placed-misc-total">
                                ₱ {subTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="order-placed-total-wrapper">
                            <div className="order-placed-misc">
                                Shipping Fee
                            </div>
                            <div className="order-placed-misc-total">
                                ₱ {shippingFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="order-placed-total-wrapper">
                            <div className="order-placed-total">Total</div>
                            <div className="order-placed-total">
                                ₱ {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="order-placed-total-wrapper">
                            <div className="order-placed-misc">
                                Including ₱ {vat.toLocaleString("en-PH", { minimumFractionDigits: 2 })} for VAT
                            </div>
                        </div>

                        <div className="order-placed-button-container">
                            <button className="back-button" onClick={goToHome}>
                                Back To Home
                            </button>
                            <button
                                className="track-order-button"
                                onClick={goToTrackOrder}
                            >
                                Track Your Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPlaced;
