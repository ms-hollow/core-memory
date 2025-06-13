import { useEffect, useState } from "react";
import UserHeader from "../../components/USERS/UserHeader";
import { IoMdSearch } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import OrderCard from "../../components/ui/OrderCard";
import { getUserOrders } from "../../apis/orderApis";
import { useAuth } from "../../context/AuthContext";
import { Order } from "../../types/orderTypes";

const UserTrackOrder = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ordersPerPage = 5;
    // const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            if (token) {
                const res = await getUserOrders(
                    token,
                    currentPage,
                    ordersPerPage
                );
                setOrders(res.data);
                setTotalPages(res.total_pages);
                setFilteredOrders(res.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, token]);

    const handlePageChange = (e: any) => {
        const newPage = Number(e.target.value);
        setCurrentPage(newPage);
        fetchOrders();
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // If search term is empty, display all orders
        if (value.trim() === "") {
            setFilteredOrders(orders); // Show all orders if no search term
        } else {
            // Filter orders based on the search term
            const filtered = orders.filter((order) => {
                const productNameMatch = order.item_orders.product_name
                    .toLowerCase()
                    .includes(value.toLowerCase());
                const orderRefIdMatch = order.order_reference_id
                    .toString()
                    .includes(value);
                return productNameMatch || orderRefIdMatch;
            });
            setFilteredOrders(filtered);
        }
    };

    return (
        <div className="default-background">
            <UserHeader />
            <div className="track-order">
                <div className="track-order-header">
                    <div className="title">Track Your Order</div>
                    <hr className="track-order__solid" />

                    <div className="page-holder">
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="Search Order or Reference ID"
                                onChange={handleSearch}
                            />
                            <IoMdSearch className="search-icon" />
                        </div>
                        <div className="page-wrapper">
                            <div className="page-text">
                                Page:
                                <select
                                    className="page-dropdown"
                                    value={currentPage}
                                    onChange={handlePageChange}
                                >
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => (
                                            <option
                                                key={index}
                                                value={index + 1}
                                            >
                                                {index + 1}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <IoIosArrowBack
                                className="page-icon"
                                onClick={handlePrevPage}
                            />
                            <IoIosArrowForward
                                className="page-icon"
                                onClick={handleNextPage}
                            />
                        </div>
                    </div>
                </div>

                <div className="track-order__container">
                    {filteredOrders.map((order, index) => (
                        <OrderCard key={index} order_data={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserTrackOrder;
