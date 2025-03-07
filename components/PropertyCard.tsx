// "Property Type: House, Bedrooms: 3+, Bathrooms: 0+, Location: Chicago, Illinois, USA, Square Footage: 400 to 1000 sqft, Budget: $100,000 to $500,000"

import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";
// import { Label } from "@radix-ui/react-label";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
import Image from 'next/image';
const Heart = lazy(() => import("lucide-react").then(module => ({ default: module.Heart })))
import { Bed, Bath, BookmarkIcon } from "lucide-react";
import RequestATour from "./RequestATour";
import RequestToApplytsx from "./RequestToApply";
import { FilterComponent } from "./FilterComponent";
const RentalListings = ({ properties }: { properties: any[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    // Function to filter properties based on the selected filter
    const filteredProperties = React.useMemo(() => {
        if (!selectedFilter) {
            return properties; // No filter applied, return all properties
        }
        if (selectedFilter === "Price High to Low") {
            return [...properties].sort((a, b) => b.price - a.price);
        } else if (selectedFilter === "Price Low to High") {
            return [...properties].sort((a, b) => a.price - b.price);
        }
        return properties;
    }, [properties, selectedFilter]);

    console.log("properties find in property card", properties, properties.length);
    if (filteredProperties.length === 0) {
        return (
            <div className="p-4">
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between">
                        {/* <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1> */}
                        <p className="text-gray-600 text-sm mb-2">{filteredProperties.length} properties available</p>
                        {/* <Button variant="outline" className="font-medium">Sort: Homes for You</Button> */}
                    </div>
                    {/* <SelectDemo /> */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-600 text-sm mb-2">No properties available</p>
                </div>
            </div>
        );
    }
    return (
        <div className="p-4 ">
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                    {/* <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1> */}
                    <p className="text-gray-600 text-sm mb-2">{filteredProperties.length} properties available</p>
                    {/* <Button variant="outline" className="font-medium">Sort: Homes for You</Button> */}
                    <FilterComponent selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
                </div>
                {/* <SelectDemo /> */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {filteredProperties.map((property, index) => {
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
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <Card className="relative cursor-pointer p-0 gap-2">
                                    <div className="relative">
                                        {property.carouselPhotos && property.carouselPhotos.length > 1 ?
                                            <Slider {...settings}>
                                                {property.carouselPhotos.map((image: { url: string }, imgIndex: number) => (
                                                    <div key={imgIndex} className="relative">
                                                        <Image src={image.url} alt="Image" layout="responsive" width={500} height={300} className="w-full h-48 object-cover rounded-t-lg" />
                                                        <Button className="absolute top-2 right-2 p-1 bg-black rounded-full w-6 h-6 shadow hover:bg-red-500">
                                                            <Suspense fallback={<div>Loading...</div>}>
                                                                <Heart className="w-4 h-4 hover:text-red-500 text-white" />
                                                            </Suspense>
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
                                                <Button
                                                    className="absolute top-2 right-2 p-1 bg-black rounded-full w-6 h-6 shadow hover:bg-red-500"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleSaveProperty(property);
                                                    }}
                                                >
                                                    <Suspense fallback={<div>Loading...</div>}>
                                                        <Heart className="w-4 h-4 text-red-500 hover:text-white" />
                                                    </Suspense>
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
                                    <CardContent className="p-2 md:p-4">
                                        <div>
                                            <div className="flex w-full gap-2 flex-col xl:flex-row xl:justify-between xl:items-center">
                                                <h2 className="text-xl font-bold">
                                                    {property?.units && property?.units.length > 0
                                                        ? `${property.units[0]?.price}`
                                                        : `${new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD' }).format(property.price)}`}
                                                </h2>
                                                <h3 className="text-sm text-gray-500 font-normal">
                                                    {property?.propertyType || ""}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1"> {property.address} {property.country}</p>

                                            <div className="w-full mt-2">

                                                {property.units?.length > 0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                                        {property.units.map((unit: { price: string, beds: number }, index: number) => (
                                                            <div key={index} className="p-2 w-[100px] rounded-lg text-center flex flex-col items-center justify-center border">
                                                                <p className="text-md font-medium">
                                                                    {unit?.price ?? 0}
                                                                </p>
                                                                <p className="text-md text-gray-500">{unit?.beds ?? 0} bds</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col w-full items-start gap-2 w-full">
                                                        <div className="text-md font-medium flex flex-row justify-evenly lg:justify-start items-center gap-6 w-full md:w-[75%]">
                                                            <div className="flex flex-row justify-between items-center gap-2">
                                                                <Bed className="w-4 h-4" /> {property.bedrooms} Beds
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center gap-2">
                                                                <Bath className="w-4 h-4" /> {property.bathrooms} Baths
                                                            </div>
                                                        </div>
                                                        <div className="w-full">
                                                            <RequestATour />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="w-[90%] h-[90%] max-w-none max-h-none p-4">
                                <DialogHeader>
                                    <DialogTitle> {property?.buildingName || property.address}</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-full w-full overflow-auto">
                                    {property.carouselPhotos && property.carouselPhotos.length > 0 ? (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 flex flex-col">
                                                <Image src={property.carouselPhotos[0].url} alt="Image" layout="responsive" width={500} height={300} className="w-full h-full object-cover rounded-lg flex-grow" />
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                {property.carouselPhotos.slice(1, 5).map((image: { url: string }, imgIndex: number) => (
                                                    <Image key={imgIndex} src={image.url} alt="Image" layout="responsive" width={500} height={300} className="w-full h-full object-cover rounded-lg" />
                                                ))}
                                            </div>

                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Image
                                                src={property?.imgSrc || "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"}
                                                alt="Image"
                                                layout="responsive"
                                                width={300}
                                                height={200}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        </div>
                                    )}
                                    {property?.carouselPhotos && property?.carouselPhotos?.length > 5 && showAllPhotos && <div className="w-full mt-4 grid grid-cols-3 gap-2">
                                        {property?.carouselPhotos?.slice(5).map((image: { url: string }, imgIndex: number) => (
                                            <Image key={imgIndex} src={image.url} alt="Image" layout="responsive" width={500} height={300} className="w-full h-full object-cover rounded-lg" />
                                        ))}
                                    </div>}
                                    {property?.carouselPhotos && property?.carouselPhotos?.length > 5 && <Button onClick={() => setShowAllPhotos(!showAllPhotos)} color="gray" className="absolute top-2 right-2">{showAllPhotos ? "Hide" : "Show All"}</Button>}

                                    <div className="mt-4">
                                        <div className="flex flex-row justify-between items-center px-2">
                                            <h2 className="text-2xl font-bold">{property?.propertyType || property?.buildingName || "House"}</h2>
                                            <div className="flex flex-row justify-between items-center gap-2">
                                                <Button variant="outline" onClick={() => window.open(`https://www.zillow.com${property.detailUrl}`, "_blank")} className="text-md font-semibold mt-2 cursor-pointer">Full Details</Button>
                                                <Button variant="outline" onClick={() => handleSaveProperty(property)} className="text-md font-semibold mt-2 cursor-pointer"><BookmarkIcon/></Button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-md font-semibold mt-2">{property.address}</p>

                                        <div className="w-full mt-4">
                                            {property.units?.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2 w-full">
                                                    {property.units.map((unit: { price: string, beds: number }, index: number) => (
                                                        <div key={index} className="p-2 w-[100px] rounded-lg text-center flex flex-col items-center justify-center border">
                                                            <p className="text-md font-bold">
                                                                {unit?.price}
                                                            </p>
                                                            <p className="text-md text-gray-500">{unit?.beds ?? 0} bds</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-2 w-[220px] rounded-lg text-center flex flex-row items-center justify-between border">
                                                    <p className="text-md font-bold">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD' }).format(property.price)}
                                                    </p>
                                                    <p className="text-md text-gray-500">{property.bedrooms} bds | {property.bathrooms} ba</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-md font-semibold">Property Details</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                                                {property.livingArea && (
                                                    <div className="flex items-center space-x-4  rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Living Area
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.livingArea} sqft
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {property?.isBuilding && (
                                                    <div className="flex items-center space-x-4 w-full rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Building Name
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property?.buildingName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {property.lotAreaValue && property.lotAreaUnit && (
                                                    <div className="flex items-center space-x-4 w-full rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Lot Area
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.lotAreaValue} {property.lotAreaUnit}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {property.listingStatus && (
                                                    <div className="flex items-center space-x-4 w-full rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Listing Status
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.listingStatus}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {property.daysOnZillow && (
                                                    <div className="flex items-center space-x-4 w-full rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Days on Zillow
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.daysOnZillow}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* {property.latitude && (
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Latitude
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.latitude}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {property.longitude && (
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Longitude
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.longitude}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )} */}
                                            </div>

                                            <div className="mt-4">
                                                <GoogleMap property={property} />
                                            </div>

                                            <div className="flex gap-4 mt-4">
                                                <RequestATour />
                                                <RequestToApplytsx />
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
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

const GoogleMap = ({ property }: { property: any }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                const google = await loadGoogleMaps();
                const mapInstance = new google.maps.Map(mapRef.current as HTMLElement, {
                    center: { lat: property.latitude, lng: property.longitude },
                    zoom: 13,
                });

                new google.maps.Marker({
                    position: { lat: property.latitude, lng: property.longitude },
                    map: mapInstance,
                });
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();
    }, [property]);

    return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
};

export default RentalListings;

const handleSaveProperty = async (property: any) => {
    const response = await fetch('/api/save_property', {
        method: 'POST',
        body: JSON.stringify({ property }),
    });
    if (response.ok) {
        console.log("Property saved");
    } else {
        console.error("Failed to save property");
    }
};
