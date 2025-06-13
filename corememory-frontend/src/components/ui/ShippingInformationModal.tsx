import { useState, useRef, useEffect } from "react";
import ShippingStepper from "./ShippingTrackingStepper";
import { Order } from "../../types/orderTypes";

interface ShippingInformationProps {
    isOpen: boolean;
    setShippingInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOrderDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
    order_data: Order;
}

const ShippingInformationModal = ({
    isOpen,
    setShippingInfoModal,
    setOrderDetailsModal,
    order_data,
}: ShippingInformationProps) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const steps = [
        "Order Placed",
        "Shipped Out",
        "In Transit",
        "Out for Delivery",
        "Delivered",
    ];

    const shippingStatusMap: Record<
        "OP1" | "SO2" | "IT3" | "OD4" | "D5", // status code set in backend
        { label: string; message: string } // corresponding label and message for each status code
    > = {
        OP1: {
            label: "Order Placed",
            message: "Your order has been placed successfully.",
        },
        SO2: {
            label: "Shipped Out",
            message: "Your parcel has been picked up by our logistics partner.",
        },
        IT3: {
            label: "In Transit",
            message: "Your parcel is on the way to your local delivery hub.",
        },
        OD4: {
            label: "Out for Delivery",
            message: "Your parcel is out for delivery and will arrive soon.",
        },
        D5: {
            label: "Delivered",
            message: "Your parcel has been delivered successfully.",
        },
    };

    // Mapping status codes to steps in the shipping process
    const stepIndexMap: Record<"OP1" | "SO2" | "IT3" | "OD4" | "D5", number> = {
        OP1: 0,
        SO2: 1,
        IT3: 2,
        OD4: 3,
        D5: 4,
    };

    // Update active step based on the order's status code
    useEffect(() => {
        if (order_data?.message_code) {
            const messageCode =
                order_data.message_code as keyof typeof stepIndexMap;
            setActiveStep(stepIndexMap[messageCode]);
        }
    }, [order_data?.message_code]);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setShippingInfoModal(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, setShippingInfoModal]);

    if (!isOpen) return null;

    const handleOrderDetailsModal = (order_data: Order) => {
        setShippingInfoModal(false);
        setOrderDetailsModal(true);
    };

    // Format the start and end dates of delivery same with ui
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

    // get the status codes from stepIndexMap to use in history
    const statusKeys = Object.keys(stepIndexMap) as Array<
        keyof typeof stepIndexMap
    >;

    // create a history of status updates with date and time
    const statusHistory =
        order_data?.date_time && Array.isArray(order_data.date_time)
            ? order_data.date_time.map((dt: string, index: number) => {
                  const key = statusKeys[index];
                  const dateObj = new Date(dt);

                  const date = dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                  });

                  const time = dateObj.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                  });

                  return {
                      date,
                      time,
                      status: shippingStatusMap[key].message,
                  };
              })
            : []; // If no date_time or it's not an array, return an empty array

    return (
        <div className="order-shipping-modal">
            <div className="modal-container" ref={modalRef}>
                <div className="shipping-header-modal">
                    <div className="shipping-header-text">
                        Shipping Information
                    </div>
                </div>
                <div className="shipping-progress-container">
                    <div className="shipping-expected-delivery">
                        Expected Delivery: {deliveryDateRange}
                    </div>

                    <div className="progress-tracker">
                        <ShippingStepper
                            steps={steps}
                            activeStep={activeStep}
                        />
                    </div>
                </div>

                <div className="shipping-status-details">
                    {statusHistory.map(
                        (
                            item: {
                                date: string;
                                time: string;
                                status: string;
                            },
                            index: number
                        ) => {
                            // Check if the current status is the active one
                            const isActive =
                                order_data.message_code === statusKeys[index];

                            return (
                                <div
                                    key={index}
                                    className="shipping-status-placeholder"
                                >
                                    <div className="date-time-holder">
                                        <div className="date-time">
                                            {item.date}
                                        </div>
                                        <div className="date-time">
                                            {item.time}
                                        </div>
                                    </div>
                                    <div
                                        className="shipping-status-text"
                                        style={
                                            isActive ? { color: "#1E8B7E" } : {}
                                        }
                                    >
                                        {item.status}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                <div className="courier-information">
                    <img
                        src="/images/default-product.png"
                        alt="Product Image"
                        className="delivery-product-image"
                    />
                    <div className="delivery-details">
                        {/*! Default/No courier yet */}
                        <div className="courier-text">Flash</div>
                        <div className="delivery-order-id">
                            {order_data.order_reference_id}
                        </div>
                    </div>
                    <button
                        className="order-details-button"
                        onClick={() => handleOrderDetailsModal(order_data)}
                    >
                        Order Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingInformationModal;
