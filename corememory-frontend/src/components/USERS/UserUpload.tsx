import { useRef } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";

interface UserUploadProps {
    uploadData: {
        attach_item: string | File;
        type: "link" | "file";
        title: string;
        description: string;
    };
    setUploadData: React.Dispatch<
        React.SetStateAction<{
            attach_item: string | File;
            type: "link" | "file";
            title: string;
            description: string;
        }>
    >;
}

const UserUpload: React.FC<UserUploadProps> = ({
    uploadData,
    setUploadData,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadData({ ...uploadData, title: e.target.value });
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadData({ ...uploadData, attach_item: e.target.value });
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setUploadData({ ...uploadData, description: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadData({ ...uploadData, attach_item: e.target.files[0] });
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="uploadForm">
                <div className="uploadForm__button">
                    <button
                        className={`file ${
                            uploadData.type === "file" ? "active" : ""
                        }`}
                        onClick={() =>
                            setUploadData({
                                ...uploadData,
                                type: "file",
                                attach_item: "",
                            })
                        }
                    >
                        Upload a File
                    </button>
                    <button
                        className={`link ${
                            uploadData.type === "link" ? "active" : ""
                        }`}
                        onClick={() =>
                            setUploadData({
                                ...uploadData,
                                type: "link",
                                attach_item: "",
                            })
                        }
                    >
                        Upload Via Link
                    </button>
                </div>

                <div className="uploadForm__details">
                    {uploadData.type === "file" && (
                        <>
                            <button
                                className="selectFile"
                                onClick={handleFileButtonClick}
                            >
                                <AiOutlineFileAdd />
                                {uploadData.attach_item instanceof File ? (
                                    uploadData.attach_item.name
                                ) : (
                                    <p>Select File</p>
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </>
                    )}

                    {uploadData.type === "link" && (
                        <input
                            type="url"
                            value={
                                typeof uploadData.attach_item === "string"
                                    ? uploadData.attach_item
                                    : ""
                            }
                            placeholder="Video Link"
                            onChange={handleLinkChange}
                            className="inputField"
                        />
                    )}

                    <input
                        type="text"
                        value={uploadData.title}
                        placeholder="Video Title"
                        onChange={handleTitleChange}
                        className="inputField"
                    />

                    <textarea
                        value={uploadData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Description"
                        className="descField"
                    />
                </div>
            </div>
        </>
    );
};

export default UserUpload;
