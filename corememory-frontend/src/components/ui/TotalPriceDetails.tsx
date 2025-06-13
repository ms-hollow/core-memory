import { FC } from "react";

type TotalPriceDetailsProps = {
    subTotal: number;
    shippingFee: number;
    total: number;
    vat: number
};

const UserTotalPriceDetails: FC<TotalPriceDetailsProps> = ({ subTotal, shippingFee, total, vat }) => (
    <div className="totalPriceDetails">
        <div>
            <p>SubTotal</p>
            <p>₱ {subTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
            <p>Shipping Fee</p>
            <p>₱ {shippingFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="total">
            <p>Total</p>
            <p>₱ {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
        <p>Including ₱ {vat.toLocaleString("en-PH", { minimumFractionDigits: 2 })} for VAT.</p>
    </div>
);

export default UserTotalPriceDetails;
