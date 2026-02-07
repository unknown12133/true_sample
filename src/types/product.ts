export interface ProductDescription {
    Features: { [key: string]: string };
    Description: string;
}

export interface ProductPrice {
    [key: string]: number;
}

export interface Product {
    product_id: string;
    userid: string;
    name: string;
    description: ProductDescription;
    price: ProductPrice;
    tag: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    image?: string; // Optional as it's constructed on frontend currently, but good to have in type
}

export interface ProductPayload {
    userid: string;
    name: string;
    description: ProductDescription;
    price: ProductPrice;
    tag: string;
    is_active: boolean;
}
