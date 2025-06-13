interface VideoItem {
    id: number;
    variant: string;
    title: string;
    description: string;
    date: string;
}

interface ListViewProps {
    data: VideoItem[];
}

const ListView = ({ data }: ListViewProps) => {
    return (
        <div className="table-container">
            <table className="memory-table">
                <thead>
                    <tr>
                        <th style={{ width: "10%" }}>Variant</th>
                        <th style={{ width: "30%" }}>Title</th>
                        <th style={{ width: "35%" }}>Description</th>
                        <th style={{ width: "23%" }}>Date of Purchase</th>
                    </tr>
                </thead>
            </table>
            <div className="table-wrapper">
                <table className="memory-table">
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <span
                                        className="variant-circle"
                                        style={{
                                            backgroundColor: item.variant,
                                        }}
                                    ></span>
                                </td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
// Exporting both components
export { ListView };
