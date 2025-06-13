import { FC } from "react";

const CardPaymentInfo: FC = () => (
    <div className="cardInfo">
        <div className="cardInfo__cardNumber">
            <div className="label-input">
                <label htmlFor="card_number">Card Number</label>
                <input type="text" name="cardNumber" placeholder="1234 1234 1234 1234" />
            </div>
            <div className="acceptedCards">
                <img src="images/visa.png" alt="Visa" />
                <img src="images/mastercard.png" alt="Mastercard" />
            </div>
        </div>
        <div className="exp-cvc">
            <div className="label-input">
                <label htmlFor="expiration">Expiration</label>
                <input type="text" name="expiration" placeholder="MM/YY" />
            </div>
            <div className="cvc">
                <div className="label-input">
                    <label htmlFor="cvc">CVC</label>
                    <input type="text" name="cvc" placeholder="CVC" />
                </div>
                <img src="images/slider.png" alt="Slider" />
            </div>
        </div>
    </div>
);

export default CardPaymentInfo;
