export type DatabaseConfig = {
    DB_DIALECT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
};

// *
export interface Core_Memory {
    attach_item: string;
    type: string;
    title: string;
    description: string;
    generated_qr_code: string;
}

// ---------

export interface Order_Details {
    user_id: number;
    product_id: number;
    coupon_id: number;
    core_memory_id: number;
    variant: string;
    quantity: number;
}

// ---------

export interface Cart_Item {
    order_detail_id: number;
    create_at: Date;
}

// ---------

export interface Order {
    user_id: number;
    order_detail_id: number;
    payment_method_id: number;
    full_name: string;
    full_address: string;
    contact_number: string;
    expected_delivery_start: Date;
    expected_delivery_end: Date;
    order_date: Date;
    order_reference_id: string;
    total_amount: number;
    proof_of_delivery: string;
    status: string;
    date_time: JSON;
    message: JSON;
    shipping_fee: number;
    tax: number;
}

// ---------

export interface User {
    user_id: number;
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    region: string;
    postal_code: string;
    contact_number: string;
    birth_date: Date;
    profile_picture: string;
    user_type_id: number;
    membership_type_id: number;
    created_at: Date;
    updated_at: Date;
    profile_picture_url: string;
}
