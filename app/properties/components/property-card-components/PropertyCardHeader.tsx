"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

type PropertyCardHeaderProps = {
    property: any;
    isSaved: boolean;
    handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    isSavingOrDeleting: boolean;
}

const CustomSlider = ({ images, handleSaveProperty, handleDeleteProperty, isSavingOrDeleting, isSaved, property }: { images: { url: string }[], handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void, handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void, isSavingOrDeleting: boolean, isSaved: boolean, property: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="min-w-full">
                            <Image
                                src={image.url}
                                alt={`Slide ${index}`}
                                layout="responsive"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Button 
                disabled={isSavingOrDeleting} 
                variant="outline" 
                className="p-3 absolute top-2 right-2 bg-white/80 hover:bg-white z-10" 
                onClick={isSaved ? (event) => handleDeleteProperty(event, property) : (event) => handleSaveProperty(event, property)}
            >
                <Heart className={`w-16 h-16 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                {/* <span className="sr-only">Add to Favorites</span> */}
            </Button>
            <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full p-2">
                <FaArrowCircleLeft size={20} />
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full p-2">
                <FaArrowCircleRight size={20} />
            </button>
        </div>
    );
};

const PropertyCardHeader = ({
    property,
    isSaved,
    handleSaveProperty,
    handleDeleteProperty,
    isSavingOrDeleting
}: PropertyCardHeaderProps) => {

    return (
        <div className="relative">
            {property.carouselPhotos && property.carouselPhotos.length > 1 ? (
                <CustomSlider images={property.carouselPhotos} handleSaveProperty={handleSaveProperty} handleDeleteProperty={handleDeleteProperty} isSavingOrDeleting={isSavingOrDeleting} isSaved={isSaved} property={property}/>
            ) : (
                <div>
                    <Image
                        src={property?.imgSrc || "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"}
                        alt="Image"
                        layout="responsive"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button 
                        disabled={isSavingOrDeleting} 
                        variant="outline" 
                        className="p-3 absolute top-2 right-2 bg-white/80 hover:bg-white" 
                        onClick={isSaved ? (event) => handleDeleteProperty(event, property) : (event) => handleSaveProperty(event, property)}
                    >
                        <Heart className={`w-6 h-6 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="sr-only">Add to Favorites</span>
                    </Button>
                </div>
            )}
            {property.specialOffer && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                    Special Offer
                </span>
            )}
            {property.tour && (
                <span className="absolute top-16 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                    3D Tour
                </span>
            )}
            {property.availabilityCount && (
                <span className="absolute top-9 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                    {property.availabilityCount} available units
                </span>
            )}
        </div>
    );
};

export default PropertyCardHeader;