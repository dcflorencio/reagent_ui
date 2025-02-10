// import React, { lazy, Suspense } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const Heart = lazy(() => import("lucide-react").then(module => ({ default: module.Heart })));

// const listings = [
//     {
//         id: 1,
//         specialOffer: true,
//         tour: false,
//         image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
//         price: "$987+",
//         beds: "1 bd",
//         name: "Williamsburg Mishawaka",
//         address: "302 Village Dr, Mishawaka, IN",
//         prices: ["$987+", "$1,184+", "$1,710+"],
//         bedTypes: ["1 bd", "2 bd", "3 bd"]
//     },
//     {
//         id: 2,
//         specialOffer: false,
//         tour: true,
//         availableUnits: 11,
//         image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
//         price: "$1,439+",
//         beds: "1 bd",
//         name: "Hartshire Lakes Apartments",
//         address: "3170 Hartshire Dr, Indianapolis, IN",
//         prices: ["$1,439+", "$1,743+", "$1,591+"],
//         bedTypes: ["1 bd", "2 bd", "3 bd"]
//     },
//     {
//         id: 3,
//         specialOffer: true,
//         tour: false,
//         image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
//         price: "$1,525+",
//         beds: "1 bd",
//         name: "The Grove",
//         address: "5813 Lilliana Ln, Whitestown, IN",
//         prices: ["$1,525+"],
//         bedTypes: ["1 bd"]
//     },
//     {
//         id: 4,
//         specialOffer: true,
//         tour: true,
//         image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
//         price: "$1,190+",
//         beds: "1 bd",
//         name: "TGM Shadeland Station",
//         address: "7135 Thatcher Dr, Indianapolis, IN",
//         prices: ["$1,190+", "$1,375+", "$1,610+"],
//         bedTypes: ["1 bd", "2 bd", "3 bd"]
//     }
// ];

// const RentalListings = ({ properties }: { properties: any[] }) => {
//     return (
//         <div className="p-4">
//             <div className="flex justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1>
//                     <p className="text-gray-600 text-sm mb-2">{properties.length} properties available</p>
//                 </div>
//                 <Button variant="outline" className="font-medium">Sort: Homes for You</Button>
//             </div>
//             {properties.length === 0 && <div className="flex justify-center items-center">
//                 <h1 className="text-2xl font-bold mb-2">No properties Available</h1>
//             </div>}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {listings.map((listing, index) => (
//                     <Card key={index} className="relative">
//                         <div className="relative">
//                             <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover rounded-t-lg" />
//                             {listing.specialOffer && (
//                                 <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
//                                     Special Offer
//                                 </span>
//                             )}
//                             {listing.tour && (
//                                 <span className="absolute top-9 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
//                                     3D Tour
//                                 </span>
//                             )}
//                             {listing.availableUnits && (
//                                 <span className="absolute top-16 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
//                                     {listing.availableUnits} available units
//                                 </span>
//                             )}
//                             <Button className="absolute top-2 right-2 p-1 bg-white rounded-full w-6 h-6 shadow">
//                                 <Suspense fallback={<div>Loading...</div>}>
//                                     <Heart className="w-4 h-4 text-gray-600" />
//                                 </Suspense>
//                             </Button>
//                         </div>
//                         <CardContent>
//                             <div className="p-2">
//                                 <h2 className="text-xl font-bold">{listing.price} {listing.beds}</h2>
//                                 <p className="text-gray-600 text-sm mt-1">{listing.address}</p>
//                                 <div className="grid grid-cols-3 gap-1 mt-4">
//                                     {listing.prices.map((price, index) => (
//                                         <div key={index} className="p-2 rounded-lg text-center flex flex-col items-center justify-center border">
//                                             <p className="text-sm font-medium">{price}</p>
//                                             <p className="text-sm text-gray-500">{listing.bedTypes[index]}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}

//                 {properties.length > 0 && properties.map((property, index) => (
//                     <Card key={index} className="relative">
//                         <div className="relative">
//                             <img src={property.imgSrc} alt={property.name} className="w-full h-48 object-cover rounded-t-lg" />
//                             {property.specialOffer && (
//                                 <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
//                                     Special Offer
//                                 </span>
//                             )}
//                             {property.tour && (
//                                 <span className="absolute top-9 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
//                                     3D Tour
//                                 </span>
//                             )}
//                             {property.availableUnits && (
//                                 <span className="absolute top-16 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
//                                     {property.availableUnits} available units
//                                 </span>
//                             )}
//                             <Button className="absolute top-2 right-2 p-1 bg-white rounded-full w-6 h-6 shadow">
//                                 <Suspense fallback={<div>Loading...</div>}>
//                                     <Heart className="w-4 h-4 text-gray-600" />
//                                 </Suspense>
//                             </Button>
//                         </div>
//                         <CardContent>
//                             <div className="p-2">
//                                 <h2 className="text-xl font-bold">{property.price} {property.currency} | {property.bedrooms} bds | {property.bathrooms} ba</h2>
//                                 <p className="text-gray-600 text-sm mt-1">{property.propertyType} | {property.address} {property.country}</p>
//                                 <div className="w-full mt-4">
//                                     {/* {property.prices.map((price: any, index: number) => ( */}
//                                     <div className="p-2 w-full rounded-lg text-center flex flex-col items-center justify-center border">
//                                         <p className="text-sm font-medium">{property.price} {property.currency}</p>
//                                         <p className="text-sm text-gray-500">{property.bedrooms} bds | {property.bathrooms} ba</p>
//                                     </div>
//                                     {/* ))} */}
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default RentalListings;
// "Property Type: House, Bedrooms: 3+, Bathrooms: 0+, Location: Chicago, Illinois, USA, Square Footage: 400 to 1000 sqft, Budget: $100,000 to $500,000"

import React, { lazy, Suspense, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "./SelectGroup";
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import React from "react";
import { MapPin } from "lucide-react";
const Heart = lazy(() => import("lucide-react").then(module => ({ default: module.Heart })))

const RentalListings = ({ properties }: { properties: any[] }) => {
    console.log("properties find in property card", properties[0], properties.length);
    if (properties.length === 0) {
        return (
            <div className="p-4">
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between">
                        {/* <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1> */}
                        <p className="text-gray-600 text-sm mb-2">{properties.length} properties available</p>
                        <Button variant="outline" className="font-medium">Sort: Homes for You</Button>
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
        <div className="p-4">
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                    {/* <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1> */}
                    <p className="text-gray-600 text-sm mb-2">{properties.length} properties available</p>
                    <Button variant="outline" className="font-medium">Sort: Homes for You</Button>
                </div>
                {/* <SelectDemo /> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {properties.map((property, index) => {
                    const [currentSlide, setCurrentSlide] = useState(0);
                    const [showAllPhotos, setShowAllPhotos] = useState(false);
                    const settings = {
                        dots: false,
                        infinite: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
                        appendDots: (dots: any) => (
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
                                <Card className="relative cursor-pointer">
                                    <div className="relative">
                                        {property.carouselPhotos && property.carouselPhotos.length > 1 ?
                                            <Slider {...settings}>
                                                {property.carouselPhotos.map((image: any, imgIndex: any) => (
                                                    <div key={imgIndex} className="relative">
                                                        <img src={image.url} alt={property.name} className="w-full h-48 object-cover rounded-t-lg" />
                                                        <Button className="absolute top-2 right-2 p-1 bg-black rounded-full w-6 h-6 shadow">
                                                            <Suspense fallback={<div>Loading...</div>}>
                                                                <Heart className="w-4 h-4 text-white" />
                                                            </Suspense>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </Slider>
                                            :
                                            <div>
                                                <img src={property?.imgSrc || "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt={property.name} className="w-full h-48 object-cover rounded-t-lg" />
                                                <Button className="absolute top-2 right-2 p-1 bg-black rounded-full w-6 h-6 shadow">
                                                    <Suspense fallback={<div>Loading...</div>}>
                                                        <Heart className="w-4 h-4 text-white" />
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
                                    {/* <CardContent>
                                        <div className="p-2">
                                            <h2 className="text-xl font-bold">{listing.price} {listing.beds}</h2>
                                            <p className="text-gray-600 text-sm mt-1">{listing.address}</p>
                                            <div className="grid grid-cols-3 gap-1 mt-4">
                                                {listing.prices.map((price, index) => (
                                                    <div key={index} className="p-2 rounded-lg text-center flex flex-col items-center justify-center border">
                                                        <p className="text-sm font-medium">{price}</p>
                                                        <p className="text-sm text-gray-500">{listing.bedTypes[index]}</p>
                                                    </div>
                                                ))} 
                                            </div>
                                        </div>
                                    </CardContent> */}
                                    <CardContent>
                                        <div className="p-2">
                                            <div className="flex flex-row justify-between items-center">
                                                <h2 className="text-xl font-bold">
                                                    {property?.units && property?.units.length > 0 
                                                        ? `${property.units[0]?.price} ${property.currency || ''}` 
                                                        : `${property.currency === "USD" ? "$" : property.currency} ${property.price}`}
                                                </h2>
                                                <h3 className="text-md text-gray-500 font-semibold">
                                                    {property?.propertyType || "House"}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1"> {property.address} {property.country}</p>

                                            <div className="w-full mt-4">
                                                {property.units?.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2 w-full">
                                                        {property.units.map((unit: any, index: number) => (
                                                            <div key={index} className="p-2 w-[100px] rounded-lg text-center flex flex-col items-center justify-center border">
                                                                <p className="text-md font-medium">{unit?.price}</p>
                                                                <p className="text-md text-gray-500">{unit?.beds ?? 0} bds</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-2 w-full rounded-lg text-center flex flex-row items-center justify-between border">
                                                        <p className="text-md font-medium">{property.currency === "USD" ? "$" : property.currency} {property.price}</p>
                                                        <p className="text-md text-gray-500">{property.bedrooms} bds | {property.bathrooms} ba</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="w-[90%] h-[90%] max-w-none max-h-none p-4">
                                <DialogHeader>
                                    <DialogTitle>{property.address}</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-full w-full overflow-auto">
                                    {property.carouselPhotos && property.carouselPhotos.length > 0 ? (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 flex flex-col">
                                                <img src={property.carouselPhotos[0].url} alt={property.name} className="w-full h-full object-cover rounded-lg flex-grow" />
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                {(showAllPhotos ? property.carouselPhotos : property.carouselPhotos.slice(1, 5)).map((image: any, imgIndex: any) => (
                                                    <img key={imgIndex} src={image.url} alt={property.name} className="w-full h-full object-cover rounded-lg" />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <img src={property?.imgSrc || "https://cdn.vectorstock.com/i/1000v/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt={property.name} className="w-full h-48 object-cover rounded-t-lg" />
                                        </div>
                                    )}
                                    {property.carouselPhotos && property.carouselPhotos.length > 5 && <Button onClick={() => setShowAllPhotos(!showAllPhotos)} color="gray" className="absolute top-2 right-2">{showAllPhotos ? "Hide" : "Show All"}</Button>}
                                    
                                    <div className="mt-4">
                                        <div className="flex flex-row justify-between items-center px-2">
                                            <h2 className="text-2xl font-bold">{property?.propertyType || property?.buildingName || "House"}</h2>
                                            <Button variant="outline" onClick={() => window.open(`https://www.zillow.com${property.detailUrl}`, "_blank")} className="text-md font-semibold mt-2">Full Details</Button>
                                        </div>
                                        <p className="text-gray-600 text-md font-semibold mt-2">{property.address}</p>

                                        <div className="w-full mt-4">
                                                {property.units?.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2 w-full">
                                                        {property.units.map((unit: any, index: number) => (
                                                            <div key={index} className="p-2 w-[100px] rounded-lg text-center flex flex-col items-center justify-center border">
                                                                <p className="text-md font-medium">{unit?.price}</p>
                                                                <p className="text-md text-gray-500">{unit?.beds ?? 0} bds</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-2 w-[200px] rounded-lg text-center flex flex-row items-center justify-between border">
                                                        <p className="text-md font-medium">{property.currency === "USD" ? "$" : property.currency} {property.price}</p>
                                                        <p className="text-md text-gray-500">{property.bedrooms} bds | {property.bathrooms} ba</p>
                                                    </div>
                                                )}
                                            </div>
                                        <div className="mt-4">
                                            <h3 className="text-md font-semibold">Property Details</h3>
                                            <div className="grid grid-cols-3 gap-1 w-full md:w-1/2">
                                                {property.livingArea && (
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
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
                                                {property.lotAreaValue && property.lotAreaUnit && (
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
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
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
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
                                                    <div className="flex items-center space-x-4 rounded-md border p-2">
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
                                                {property.latitude && (
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
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                <MapContainer center={[property.latitude, property.longitude]} zoom={13} style={{ height: "400px", width: "100%" , borderRadius: "10px"}}>
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <Marker position={[property.latitude, property.longitude]}>
                                                        <Popup>
                                                            {property.address}
                                                        </Popup>
                                                    </Marker>
                                                </MapContainer>
                                            </div>

                                            <div className="flex gap-4 mt-4">
                                                <Button className="flex-1">Request a tour</Button>
                                                <Button className="flex-1" variant="outline">Request to apply</Button>
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

export default RentalListings;
