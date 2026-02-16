// ItemViewer3D.jsx - 3D Viewer for Menu Items
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

/**
 * 3D Card Component - Displays item in 3D space
 */
function ItemCard3D({ item }) {
    return (
        <group>
            {/* Main Card */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 4, 0.2]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Card Border */}
            <mesh position={[0, 0, 0.11]}>
                <boxGeometry args={[2.8, 3.8, 0.05]} />
                <meshStandardMaterial color="#f3f4f6" />
            </mesh>

            {/* Item Info as HTML Overlay */}
            <Html
                position={[0, 0, 0.15]}
                transform
                occlude
                style={{
                    width: '280px',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    pointerEvents: 'none'
                }}
            >
                <div className="text-center">
                    {/* Item Image */}
                    {item.ImageUrl && (
                        <img
                            src={item.ImageUrl}
                            alt={item.Name}
                            className="w-48 h-48 object-cover rounded-lg mb-4 shadow-lg"
                            style={{ pointerEvents: 'none' }}
                        />
                    )}

                    {/* Item Name */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {item.Name}
                    </h2>

                    {/* Category */}
                    {item.Category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                            {item.Category}
                        </span>
                    )}

                    {/* Price */}
                    <p className="text-3xl font-bold text-green-600">
                        {item.Price} {item.TypeOfMoney}
                    </p>

                    {/* Size */}
                    {item.Size > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            Size: {item.Size}
                        </p>
                    )}
                </div>
            </Html>

            {/* Decorative elements */}
            <mesh position={[0, 2.2, 0.15]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}

/**
 * ItemViewer3D Component - Main 3D viewer
 */
function ItemViewer3D() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                let endpoint = '';

                // Determine API endpoint based on type
                switch (type?.toLowerCase()) {
                    case 'food':
                        endpoint = `${API_BASE_URL}/api/food/${id}`;
                        break;
                    case 'drink':
                        endpoint = `${API_BASE_URL}/api/drink/${id}`;
                        break;
                    case 'sweet':
                        endpoint = `${API_BASE_URL}/api/sweet/${id}`;
                        break;
                    default:
                        throw new Error('Invalid item type');
                }

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error('Item not found');
                }

                const data = await response.json();

                // Normalize the data
                const normalizedItem = {
                    Id: data.Id ?? data.id ?? id,
                    Name: data.Name ?? data.name ?? 'Unknown Item',
                    Category: data.Category ?? data.category ?? type,
                    ImageUrl: data.ImageUrl ?? data.imageUrl ?? '',
                    Price: Number(data.Price ?? data.price ?? 0),
                    Size: Number(data.Size ?? data.size ?? 0),
                    TypeOfMoney: data.TypeOfMoney ?? data.typeOfMoney ?? 'دینار'
                };

                setItem(normalizedItem);
            } catch (err) {
                console.error('Error fetching item:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (type && id) {
            fetchItem();
        }
    }, [type, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading 3D View...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The requested item could not be loaded.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">3D View</h1>
                        <p className="text-sm text-gray-600">Use mouse/touch to rotate and zoom</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-700 font-medium"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* 3D Canvas */}
            <Canvas
                shadows
                className="w-full h-screen"
                gl={{ antialias: true, alpha: false }}
            >
                {/* Camera */}
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffa500" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.5}
                    castShadow
                />

                {/* Item Card */}
                <ItemCard3D item={item} />

                {/* Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={4}
                    maxDistance={15}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />

                {/* Background */}
                <color attach="background" args={['#f8fafc']} />
            </Canvas>

            {/* Footer Info */}
            <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">{item.Name}</span> • {item.Price} {item.TypeOfMoney}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ItemViewer3D;
