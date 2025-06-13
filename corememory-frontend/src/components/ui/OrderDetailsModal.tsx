import { useEffect, useRef } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Order } from "../../types/orderTypes";

interface OrderDetailsProps {
    isOpen: boolean;
    setOrderDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShippingInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
    order_data: Order;
}

const OrderDetails = ({
    isOpen,
    setOrderDetailsModal,
    setShippingInfoModal,
    order_data,
}: OrderDetailsProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    const formatDeliveryDates = (start: string, end: string): string => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
        };

        const startFormatted = startDate.toLocaleDateString("en-GB", options);
        const endFormatted = endDate.toLocaleDateString("en-GB", options);

        return `${startFormatted} - ${endFormatted}`;
    };

    const deliveryDateRange = formatDeliveryDates(
        order_data.expected_delivery_start,
        order_data.expected_delivery_end
    );

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setOrderDetailsModal(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, setOrderDetailsModal]);

    if (!isOpen) return null;

    const handleShippingInfoModal = () => {
        setOrderDetailsModal(false);
        setShippingInfoModal(true);
    };

    return (
        <>
            <div className="order-shipping-modal">
                <div className="modal-container" ref={modalRef}>
                    <div className="header-order">
                        <div className="order-text">Order Details</div>
                    </div>

                    <div
                        className="shipping-info-header"
                        onClick={handleShippingInfoModal}
                    >
                        <img
                            src="/icons/in-transit.svg"
                            alt="In-Transit"
                            className="icon"
                        />
                        <h4>
                            {order_data.status} • Expected Delivery:{" "}
                            {deliveryDateRange}
                        </h4>
                        <MdArrowForwardIos className="forward-icon" />
                    </div>

                    <div className="user-details">
                        <h4>Delivery Information</h4>
                        <div className="user-information-holder">
                            <SlLocationPin className="location-icon" />
                            <div className="user-name">
                                {order_data.full_name}
                            </div>
                            <div className="user-contact">
                                {order_data.contact_number}
                            </div>
                        </div>

                        <div className="address-holder">
                            <div className="address">
                                {order_data.full_address}
                            </div>
                        </div>
                    </div>

                    <div className="product-info">
                        <img
                            src={
                                order_data.item_orders.product_image ||
                                "/images/default-product.png"
                            }
                            alt="Product"
                            className="product-img"
                        />
                        <div className="holder">
                            <div className="product-price">
                                <div className="product-name">
                                    {order_data.item_orders.product_name}
                                </div>
                                <div className="product-price">
                                    ₱ {order_data.item_orders.product_price}
                                </div>
                            </div>
                            <div className="product-variant">
                                Variant: {order_data.item_orders.variant}
                            </div>
                            <div className="product-qty">
                                Quantity: {order_data.item_orders.quantity}
                            </div>
                        </div>
                    </div>

                    <hr className="broken-divider" />

                    <div className="product-total-info">
                        <div className="subtotal-info-holder">
                            <div>SubTotal</div>
                            <div>₱ {order_data.total_amount}</div>
                        </div>
                        <div className="shipping-info-holder">
                            <div>Shipping Fee</div>
                            <div>₱ {order_data.shipping_fee}</div>
                        </div>
                        <div className="total-info-holder">
                            <div className="total-text">Total</div>
                            <div className="total-text">
                                ₱ {order_data.total_amount}
                            </div>
                        </div>
                        <div className="taxes-text">
                            Including ₱{order_data.vat} in taxes.
                        </div>
                    </div>

                    <hr className="solid-divider" />

                    <div className="order-payment">
                        <div className="order-id-holder">
                            <div className="order-id">Order ID</div>
                            <div className="order-id-ref">
                                {order_data.order_reference_id}
                            </div>
                        </div>
                        <div className="payment-method-holder">
                            <div className="payment-method">Payment Method</div>
                            <div className="payment-service">Gcash</div>
                        </div>
                    </div>

                    <div className="help-container">
                        <FaRegQuestionCircle className="q-icon" />
                        <div className="help-text">Help Center</div>
                        <MdArrowForwardIos className="f-icon" />
                    </div>

                    <div className="button-container">
                        <button className="return-refund-button">
                            Return/Refund
                        </button>
                        <button className="rate-button">Rate</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
