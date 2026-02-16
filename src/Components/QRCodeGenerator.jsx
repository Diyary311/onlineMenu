// QRCodeGenerator.jsx - Component for generating and displaying QR codes
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

/**
 * QRCodeGenerator Component
 * Generates a QR code for viewing menu items in 3D
 * 
 * @param {string} url - The URL to encode in the QR code
 * @param {string} itemName - Name of the item (for display)
 * @param {function} onClose - Callback function when modal is closed
 */
function QRCodeGenerator({ url, itemName, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Scan to View in 3D
                </h2>
                {itemName && (
                    <p className="text-gray-600 mb-4">{itemName}</p>
                )}

                {/* QR Code */}
                <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <QRCodeSVG
                        value={url}
                        size={256}
                        level="H"
                        includeMargin={true}
                        className="shadow-lg"
                    />
                </div>

                {/* URL Display */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direct Link:
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={url}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none"
                        />
                        <button
                            onClick={handleCopyUrl}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>📱 How to use:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                        <li>Open your phone's camera app</li>
                        <li>Point it at the QR code above</li>
                        <li>Tap the notification to open the 3D view</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default QRCodeGenerator;
