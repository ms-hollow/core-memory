
interface UserPurchaseDetailsProps {
    selectedVariant: string | null;
    setSelectedVariant: React.Dispatch<React.SetStateAction<string | null>>;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

interface Variant {
    color: string;
    name: string;
}

const UserPurchaseDetails: React.FC<UserPurchaseDetailsProps> = ({ selectedVariant, setSelectedVariant, quantity, setQuantity }) => {
    const variants: Variant[] = [
        { color: "#EEB108", name: "Joy" },
        { color: "#D20404", name: "Anger" },
        { color: "#84D632", name: "Disgust" },
        { color: "#2B65FB", name: "Sadness" },
        { color: "#A500DF", name: "Fear" },
    ];

    const min = 1;
    const max = 100;

    const handleSelectedVariant = (variant: Variant) => {
        setSelectedVariant(variant.name); 
    };

    const handleIncrement = () => {
        if (quantity < max) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > min) setQuantity(prev => prev - 1);
    };

    return (
        <div className="purchaseDetails">
            <img src="/images/product-placeholder-2.png" alt="Product" />
            
            <div className="purchaseDetails__variants">
                <h1>Variant</h1>
                
                {variants.map((variant, index) => (
                    <div key={index} className="product" onClick={() => handleSelectedVariant(variant)}>
                        <div 
                            className="product__color" 
                            style={{ backgroundColor: variant.color}}>
                        </div>
                        {selectedVariant === variant.name && ( 
                            <p style={{ color: variant.color}}>{variant.name}</p> 
                        )}
                    </div>
                ))}
                
            </div>

            <div className="purchaseDetails__quantity">
                <h1>Quantity</h1>
                <div className="quantityField">
                    <button onClick={handleDecrement}> - </button>
                    <input
                        type="number"
                        value={quantity}
                        readOnly
                    />
                    <button onClick={handleIncrement}> + </button>
                </div>
            </div>
        </div>
    )
}

export default UserPurchaseDetails;