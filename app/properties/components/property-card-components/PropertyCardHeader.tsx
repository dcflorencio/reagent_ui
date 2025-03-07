"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Slider from "react-slick";

type PropertyCardHeaderProps = {
    property: any;
    isSaved: boolean;
    handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    isSavingOrDeleting: boolean;
}
const PropertyCardHeader = ({ property,
    isSaved,
    handleSaveProperty,
    handleDeleteProperty,
    isSavingOrDeleting
}: PropertyCardHeaderProps) => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
        appendDots: (dots: React.ReactNode) => (
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <ul style={{ margin: '0px' }}> {dots} </ul>
            </div>
        ),
        customPaging: (i: number) => (
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: i === currentSlide ? 'white' : 'black',
                    display: 'inline-block',
                    margin: '0 5px'
                }}
            />
        ),
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };
    return (
        <div className="relative">
            {property.carouselPhotos && property.carouselPhotos.length > 1 ?
                <Slider {...settings}>
                    {property.carouselPhotos.map((image: { url: string }, imgIndex: number) => (
                        <div key={imgIndex} className="relative">
                            <Image src={image.url} alt="Image" layout="responsive" width={500} height={300} className="w-full h-48 object-cover rounded-t-lg" />
                            <Button disabled={isSavingOrDeleting} variant="outline" className="p-3 absolute top-2 right-2" onClick={isSaved ? (event) => handleDeleteProperty(event, property) : (event) => handleSaveProperty(event, property)}>
                                <Heart className={`w-6 h-6 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                                <span className="sr-only">Add to Favorites</span>
                            </Button>
                        </div>
                    ))}
                </Slider>
                :
                <div>
                    <Image
                        src={property?.imgSrc || "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"}
                        alt="Image"
                        layout="responsive"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button disabled={isSavingOrDeleting} variant="outline" className="p-3" onClick={isSaved ? (event) => handleDeleteProperty(event, property) : (event) => handleSaveProperty(event, property)}>
                        <Heart className={`w-6 h-6 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="sr-only">Add to Favorites</span>
                    </Button>
                </div>}
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

const SampleNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "transparent", right: "10px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};

const SamplePrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "transparent", left: "10px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};

export default PropertyCardHeader;