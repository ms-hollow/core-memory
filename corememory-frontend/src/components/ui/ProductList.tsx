import React from "react";

type OrderDetail= {
    order_detail_id: number;
    user_id: number;
    coupon_id: number | null;
    product_id: number;
    core_memory_id: number;
    variant: string;
    quantity: number;
    discount_value: number;
    price_at_purchase: number;
};
  
type Props = {
    orderDetails: OrderDetail[] | null;
};

const UserProductList: React.FC<Props> = ({ orderDetails }) => {
    if (!Array.isArray(orderDetails)) return;

    return (
        <>
            {orderDetails.map((order) => {
                return (
                    <div key={order.order_detail_id} className="product">
                        <img src="/images/default-product.png" alt="Product" />
                        <div className="product__details">
                            <div className="title-price">
                                <h2>Core Memory Globe</h2>
                                <h4>₱ {order.price_at_purchase.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</h4>
                            </div>
                            <p>Variant: {order.variant}</p>
                            <p>Quantity: {order.quantity}</p>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default UserProductList;
