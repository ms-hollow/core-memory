import { FC } from "react";

type PaymentMethodSelectorProps = {
    paymentMethod: "card" | "gcash" | "paypal";
    setPaymentMethod: (method: "card" | "gcash" | "paypal") => void;
};

const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <div className="methodContainer">
            <h1>Payment Method</h1>
            <p>All transactions are secured and encrypted.</p>
            <div className="choices">
                {["card", "gcash", "paypal"].map((method) => (
                    <button
                        key={method}
                        className={`${paymentMethod === method ? "active" : ""}`}
                        onClick={() => setPaymentMethod(method as "card" | "gcash" | "paypal")}
                    >
                        <img
                            src={`icons/${method}-icon.png`}
                            alt={method}
                            className={`${method}-icon`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
