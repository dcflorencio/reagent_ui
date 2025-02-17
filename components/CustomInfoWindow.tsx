import React from "react";

interface InfoWindowProps {
  property: any;
  position: google.maps.LatLng | null;
  onClose: () => void;
}

const CustomInfoWindow: React.FC<InfoWindowProps> = ({ property, position, onClose }) => {
  if (!position) return null;

  return (
    <div
      className="absolute z-50 bg-white shadow-lg p-4 rounded-lg"
      style={{
        top: position.lat(), // Adjust position using latLng
        left: position.lng(),
        transform: "translate(-50%, -100%)", // Center above marker
      }}
    >
      <button onClick={onClose} className="absolute top-1 right-1 text-gray-500">✖</button>
      <h4 className="text-lg font-semibold">{property.name || "Power Line"}</h4>
      <p className="text-sm text-gray-600">{property.operator || "Power Line"}</p>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="bg-indigo-50 p-2 rounded">
          <p className="text-xs text-gray-600">Frequency</p>
          <p className="text-lg font-bold text-indigo-600">{property.frequency || "-"}</p>
        </div>
        <div className="bg-indigo-100 p-2 rounded">
          <p className="text-xs text-gray-600">Voltages</p>
          <p className="text-lg font-bold text-indigo-700">{property.voltages || "-"}</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded">
          <p className="text-xs text-gray-600">Max Voltage</p>
          <p className="text-lg font-bold text-indigo-600">{property.max_voltage || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomInfoWindow;
