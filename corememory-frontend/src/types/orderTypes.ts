export interface OrderStatus {
    order_status_id: number;
    status: string;
    date_time: string;
    message: string;
}

export interface OrderDetail {
    order_detail_id: number;
    user_id: number;
    coupon_id: number;
    product_id: number;
    core_memory_id: number;
    variant: string;
    quantity: number;
    discount_value: number;
    price_at_purchase: number;
}

export interface Product {
    product_id: number;
    product_name: string;
    product_image: string;
    description: string;
    variant: string[];
    stock_quantity: number;
    price: number;
}

export interface Order {
    order_id: number;
    user_id: number;
    order_detail_id: number;
    payment_method_id: number;
    full_name: string;
    full_address: string;
    contact_number: string;
    expected_delivery_start: string;
    expected_delivery_end: string;
    order_date: Date;
    order_reference_id: string;
    total_amount: number;
    proof_of_delivery: string;
    status: string;
    date_time: any;
    message_code: string;
    shipping_fee: number;
    vat: number;
    item_orders: {
        order_id: number;
        order_status: string;
        product_name: string;
        product_image: string;
        variant: string;
        quantity: number;
        product_price: number;
        total_amount: number;
    };
}
