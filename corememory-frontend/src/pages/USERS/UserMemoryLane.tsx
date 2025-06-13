import { useState, useEffect } from "react";
import UserHeader from "../../components/USERS/UserHeader";
import { useAuth } from "../../context/AuthContext";
import { getCoreMemory } from "../../apis/corememoryApi";
import QRCodeModal from "../../components/ui/CoreMemoryQRModal";

interface CoreMemoryItem {
    id: number;
    variant: string;
    title: string;
    description: string;
    order_date: string;
    generated_qr_code: string;
}

const variantColors: { [key: string]: string } = {
    joy: "#EEB108",
    anger: "#D20404",
    disgust: "#84D632",
    sadness: "#2B65FB",
    fear: "#A500DF",
};

const UserMemoryLane = () => {
    const { token } = useAuth();
    const [data, setData] = useState<CoreMemoryItem[]>([]);
    const [isQRCodeModalOpen, setQRCodeModal] = useState(false);
    const [selectedCoreMemory, setSelectedCoreMemory] = useState<string>("");

    useEffect(() => {
        if (token) {
            const fetchCoreMemory = async () => {
                try {
                    const coreMemory = await getCoreMemory(token);
                    if (coreMemory && coreMemory.data) {
                        setData(coreMemory.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch core memory:", error);
                }
            };
            fetchCoreMemory();
        }
    }, [token]);

    const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear().toString().slice(-2);

        return `${day < 10 ? "0" + day : day}-${month}-${year}`;
    };

    const openQRCodeModal = (qrCode: string) => {
        setSelectedCoreMemory(qrCode);
        setQRCodeModal(true);
    };

    return (
        <div className="default-background">
            <UserHeader />
            <div className="container">
                <div className="header-container">
                    <div className="title">Memory Lane</div>
                </div>
                <div className="contents-container">
                    <div className="table-container">
                        <table className="memory-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Variant</th>
                                    <th style={{ width: "30%" }}>Title</th>
                                    <th style={{ width: "40%" }}>
                                        Description
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        Date of Purchase
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0
                                    ? data.map((item, index) => (
                                          <tr
                                              key={item.id || index}
                                              onClick={() =>
                                                  openQRCodeModal(
                                                      item.generated_qr_code
                                                  )
                                              }
                                          >
                                              <td>
                                                  <span
                                                      className="variant-circle"
                                                      style={{
                                                          backgroundColor:
                                                              item.variant
                                                                  ? variantColors[
                                                                        item.variant.toLowerCase()
                                                                    ] || "#000"
                                                                  : "#000",
                                                      }}
                                                  ></span>
                                              </td>
                                              <td>{item.title}</td>
                                              <td>{item.description}</td>
                                              <td>
                                                  {formatDate(item.order_date)}
                                              </td>
                                          </tr>
                                      ))
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* QR Code Modal */}
            <QRCodeModal
                isOpen={isQRCodeModalOpen}
                setQRCodeModal={setQRCodeModal}
                generated_qr_code={selectedCoreMemory}
            />
        </div>
    );
};

export default UserMemoryLane;
