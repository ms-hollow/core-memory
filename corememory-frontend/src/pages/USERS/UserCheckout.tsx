import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderDetailById } from "../../apis/order-detailApis";
import { getOrderById, deleteOrderById, updateOrder } from "../../apis/orderApis";

import PaymentMethodSelector from "../../components/UI/PaymentMethodSelector";
import CardPaymentInfo from "../../components/UI/CardPaymentInfo";
import ProductList from "../../components/UI/ProductList";
import TotalPriceDetails from "../../components/UI/TotalPriceDetails";

const paymentMethodMap: Record<"card" | "gcash" | "paypal", number> = {
    card: 1,
    paypal: 2,
    gcash: 3,
};

const UserCheckout = () => {
    const { token } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "gcash" | "paypal">("card");
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

    const handlePaymentMethodChange = useCallback((method: "card" | "gcash" | "paypal") => {
        setPaymentMethod(method);
    }, []);

    const handleProceed = async () => {
        if (!token || !orderDetailsIDs || !orderIDs) return;

        try {
            await Promise.all(
                orderIDs.map((id) => 
                    updateOrder( 
                        { order_id: id, payment_method_id: paymentMethodMap[paymentMethod] },
                         token
                    ).then((res) => res.data)
                )
            );

        } catch (error) {
            console.error("Error fetching orders", error);
        }

        navigate("/order-placed", { state: { orderDetailsIDs, orderIDs } });
    };

    const handleBack = async () => {

        if (!token || !orderDetailsIDs || !orderIDs) return;

        try {
            await Promise.all(
                orderIDs.map((id) => deleteOrderById(id, token).then((res) => res.data))
            );

        } catch (error) {
            console.error("Error fetching orders", error);
        }

        navigate("/order-details", { state: { orderDetailsIDs } });
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

            <div className="checkout">
                <div className="paymentMethod">
                    <PaymentMethodSelector
                        paymentMethod={paymentMethod}
                        setPaymentMethod={handlePaymentMethodChange}
                    />

                    <div className="paymentMethod__info">
                        {paymentMethod === "card" && <CardPaymentInfo />}
                        {paymentMethod !== "card" && (
                            <div className="gcash-paypal-info">
                                After clicking "Proceed Payment", you will be redirected to {paymentMethod.toUpperCase()} to complete your purchase securely.
                            </div>
                        )}
                    </div>

                    <div className="paymentMethod__buttons">
                        <button onClick={handleBack}>Back</button>
                        <button className="proceed" onClick={handleProceed}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>

                <div className="checkout__orderedProducts">
                    <ProductList orderDetails={orderDetails} />

                    <div className="discount">
                        <input type="text" name="discount_code" placeholder="Discount Code" />
                        <button>Apply</button>
                    </div>

                    <TotalPriceDetails subTotal={subTotal} shippingFee={shippingFee} total={total} vat={vat}/>
                </div>

                <div className="checkout__policyLinks">
                    <a href="">Refund Policy</a>
                    <a href="">Shipping Policy</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Terms of Service</a>
                </div>
            </div>
        </div>
    );
};

export default UserCheckout;