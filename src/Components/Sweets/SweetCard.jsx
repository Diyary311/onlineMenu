import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import QRCodeGenerator from "../QRCodeGenerator";

function SweetCard({ id, name, price, size, image, type = "sweet" }) {
    const [showQR, setShowQR] = useState(false);
    const navigate = useNavigate();

    const handle3DView = (e) => {
        e.stopPropagation();
        navigate(`/view3d/${type}/${id}`);
    };

    const handleQRCode = (e) => {
        e.stopPropagation();
        setShowQR(true);
    };

    const view3DURL = `${window.location.origin}/view3d/${type}/${id}`;

    return (
        <>
            <div
                className="flex flex-col items-center p-1 sm:p-2 rounded-md shadow-md cursor-pointer border border-purple-100 relative group"
                style={{
                    width: "clamp(150px, 40vw, 190px)",
                    height: "clamp(200px, 53vw, 245px)",
                    minWidth: "140px",
                    minHeight: "190px",
                    maxWidth: "190px",
                    maxHeight: "245px",
                    backgroundColor: "#F3E8FF",
                }}
            >
                <div className="w-full flex justify-center mb-1 sm:mb-2">
                    <img
                        src={
                            image
                                ? `${API_BASE_URL}${image}`
                                : "https://via.placeholder.com/150"
                        }
                        alt={name}
                        className="object-contain"
                        style={{
                            width: "clamp(130px, 35vw, 165px)",
                            height: "clamp(140px, 38vw, 180px)",
                        }}
                    />
                </div>

                <div className="flex flex-col flex-1 w-full justify-between px-1 sm:px-2">
                    <p
                        className="font-bold text-center mb-1 line-clamp-2 leading-tight"
                        style={{ color: "#000000", fontSize: "clamp(0.7rem, 3vw, 0.9rem)" }}
                    >
                        {name}
                    </p>

                    <div className="mt-auto">
                        <p
                            className="text-center mb-1 sm:mb-2 leading-tight"
                            style={{
                                color: "#000000",
                                fontSize: "clamp(0.6rem, 2.5vw, 0.75rem)",
                            }}
                        >
                            Size: {size}
                        </p>

                        <div className="flex justify-center">
                            <div
                                className="px-2 sm:px-3 py-1 rounded-sm text-white font-bold text-center min-w-[60px]"
                                style={{
                                    backgroundColor: "#7C3AED",
                                    fontSize: "clamp(0.7rem, 3vw, 0.9rem)",
                                }}
                            >
                                دینار{price}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 rounded-md">
                    <button
                        onClick={handle3DView}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        View in 3D
                    </button>
                    <button
                        onClick={handleQRCode}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        QR Code
                    </button>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <QRCodeGenerator
                    url={view3DURL}
                    itemName={name}
                    onClose={() => setShowQR(false)}
                />
            )}
        </>
    );
}

export default SweetCard;

