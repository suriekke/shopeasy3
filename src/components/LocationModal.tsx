import React, { useState, useRef, useEffect } from 'react';
import type { Location, Address } from '../types';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSetLocation: (location: Location) => void;
    savedAddresses: Address[];
}

// Mock addresses for simulation
const MOCK_INDIAN_ADDRESSES = [
    '12, MG Road, Bengaluru, Karnataka 560001',
    'A-45, Connaught Place, New Delhi, Delhi 110001',
    '7, Park Street, Kolkata, West Bengal 700016',
    'Gateway of India, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
    'Hitech City Main Rd, Madhapur, Hyderabad, Telangana 500081',
    '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038'
];

// Reusable Map Pin Icon
const MapPinIcon: React.FC<{ isDragging: boolean }> = ({ isDragging }) => (
    <svg className={`w-10 h-10 text-brand-red drop-shadow-lg absolute transform -translate-x-1/2 -translate-y-full transition-transform duration-150 ${isDragging ? 'scale-125' : ''}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
);

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSetLocation, savedAddresses }) => {
    const [addressInput, setAddressInput] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    // Helper to create a new location object
    const createNewLocation = (address: string): Location => {
        return {
            address: address,
            deliveryTime: 'Delivering in 10 mins'
        };
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setIsDetecting(true);
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Use reverse geocoding to get actual address
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        const address = data.display_name || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                        onSetLocation(createNewLocation(address));
                    } else {
                        // Fallback to coordinates if geocoding fails
                        const address = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                        onSetLocation(createNewLocation(address));
                    }
                } catch (error) {
                    // Fallback to a simple address format
                    const { latitude, longitude } = position.coords;
                    const address = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                    onSetLocation(createNewLocation(address));
                }
                setIsDetecting(false);
            },
            (err) => {
                let errorMessage = "An unexpected error occurred.";
                if (err.code === err.PERMISSION_DENIED) {
                    errorMessage = "Location access denied. Please enable it in your browser settings.";
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                } else if (err.code === err.TIMEOUT) {
                    errorMessage = "The request to get user location timed out.";
                }
                setError(errorMessage);
                setIsDetecting(false);
            },
            { 
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };

    const handleSelectSavedAddress = (address: Address) => {
        const fullAddress = `${address.type} - ${address.line1}, ${address.city}`;
        onSetLocation(createNewLocation(fullAddress));
    };

    const handleSetManualLocation = () => {
        if (!addressInput.trim()) {
            setError("Please enter a location or select one from the map.");
            return;
        }
        onSetLocation(createNewLocation(addressInput));
    };

    // --- Draggable Pin Logic ---
    const handleInteractionStart = () => {
        setError(null);
        setIsDragging(true);
    };

    const handleInteractionMove = (clientX: number, clientY: number) => {
        if (isDragging && mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            let x = ((clientX - rect.left) / rect.width) * 100;
            let y = ((clientY - rect.top) / rect.height) * 100;
            x = Math.max(0, Math.min(100, x));
            y = Math.max(0, Math.min(100, y));
            setPinPosition({ x, y });
        }
    };

    const handleInteractionEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            const droppedAddress = MOCK_INDIAN_ADDRESSES[Math.floor(Math.random() * MOCK_INDIAN_ADDRESSES.length)];
            setAddressInput(droppedAddress);
        }
    };
    
    // Reset internal state when modal is closed externally
    useEffect(() => {
        if (!isOpen) {
            setIsDetecting(false);
            setError(null);
            setAddressInput('');
            setPinPosition({ x: 50, y: 50 });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
            onMouseUp={handleInteractionEnd}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleInteractionEnd}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all" onMouseUp={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Set delivery location</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close location modal">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Manual Input & Map Confirmation */}
                    <div className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            placeholder="Search for area or street name"
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none"
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                        />
                        <button 
                            onClick={handleSetManualLocation}
                            className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Set
                        </button>
                    </div>
                    
                    {/* Location Detection */}
                    <button 
                        onClick={handleDetectLocation} 
                        disabled={isDetecting}
                        className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition disabled:opacity-50"
                    >
                         {isDetecting ? 'Detecting...' : 'Detect my location'}
                    </button>
                    
                    {/* Interactive Map */}
                    <div 
                        ref={mapRef}
                        className="relative h-56 bg-gray-200 rounded-lg overflow-hidden cursor-move"
                        onMouseDown={handleInteractionStart}
                        onTouchStart={handleInteractionStart}
                    >
                         <img 
                            src="https://i.imgur.com/AlC2y2k.png" 
                            alt="Map of a city" 
                            className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }} className="absolute">
                           <MapPinIcon isDragging={isDragging} />
                        </div>
                    </div>

                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && (
                        <div>
                            <p className="font-semibold text-gray-700 mb-3">Saved addresses</p>
                            <div className="flex flex-wrap gap-3 text-sm">
                               {savedAddresses.map(addr => (
                                    <button 
                                        key={addr.id}
                                        onClick={() => handleSelectSavedAddress(addr)}
                                        className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 hover:border-brand-purple transition"
                                    >
                                        {addr.type} • {addr.line1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};