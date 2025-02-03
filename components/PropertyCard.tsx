import React, { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Heart = lazy(() => import("lucide-react").then(module => ({ default: module.Heart })));

const listings = [
    {
        id: 1,
        specialOffer: true,
        tour: false,
        image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
        price: "$987+",
        beds: "1 bd",
        name: "Williamsburg Mishawaka",
        address: "302 Village Dr, Mishawaka, IN",
        prices: ["$987+", "$1,184+", "$1,710+"],
        bedTypes: ["1 bd", "2 bd", "3 bd"]
    },
    {
        id: 2,
        specialOffer: false,
        tour: true,
        availableUnits: 11,
        image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
        price: "$1,439+",
        beds: "1 bd",
        name: "Hartshire Lakes Apartments",
        address: "3170 Hartshire Dr, Indianapolis, IN",
        prices: ["$1,439+", "$1,743+", "$1,591+"],
        bedTypes: ["1 bd", "2 bd", "3 bd"]
    },
    {
        id: 3,
        specialOffer: true,
        tour: false,
        image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
        price: "$1,525+",
        beds: "1 bd",
        name: "The Grove",
        address: "5813 Lilliana Ln, Whitestown, IN",
        prices: ["$1,525+"],
        bedTypes: ["1 bd"]
    },
    {
        id: 4,
        specialOffer: true,
        tour: true,
        image: "https://photos.zillowstatic.com/fp/94b0f271bb2ebf2fe93a0646d1cb0756-p_e.webp",
        price: "$1,190+",
        beds: "1 bd",
        name: "TGM Shadeland Station",
        address: "7135 Thatcher Dr, Indianapolis, IN",
        prices: ["$1,190+", "$1,375+", "$1,610+"],
        bedTypes: ["1 bd", "2 bd", "3 bd"]
    }
];

const RentalListings = ({ properties }: { properties: any[] }) => {
    return (
        <div className="p-4">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Indiana Rental Listings</h1>
                    <p className="text-gray-600 text-sm mb-2">{properties.length} properties available</p>
                </div>
                <Button variant="outline" className="font-medium">Sort: Homes for You</Button>
            </div>
            {properties.length === 0 && <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold mb-2">No properties Available</h1>
            </div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* {listings.map((listing, index) => (
                    <Card key={index} className="relative">
                        <div className="relative">
                            <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover rounded-t-lg" />
                            {listing.specialOffer && (
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                    Special Offer
                                </span>
                            )}
                            {listing.tour && (
                                <span className="absolute top-9 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                                    3D Tour
                                </span>
                            )}
                            {listing.availableUnits && (
                                <span className="absolute top-16 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                    {listing.availableUnits} available units
                                </span>
                            )}
                            <Button className="absolute top-2 right-2 p-1 bg-white rounded-full w-6 h-6 shadow">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Heart className="w-4 h-4 text-gray-600" />
                                </Suspense>
                            </Button>
                        </div>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                ))} */}

                {properties.length > 0 && properties.map((property, index) => (
                    <Card key={index} className="relative">
                        <div className="relative">
                            <img src={property.imgSrc} alt={property.name} className="w-full h-48 object-cover rounded-t-lg" />
                            {property.specialOffer && (
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                    Special Offer
                                </span>
                            )}
                            {property.tour && (
                                <span className="absolute top-9 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                                    3D Tour
                                </span>
                            )}
                            {property.availableUnits && (
                                <span className="absolute top-16 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                    {property.availableUnits} available units
                                </span>
                            )}
                            <Button className="absolute top-2 right-2 p-1 bg-white rounded-full w-6 h-6 shadow">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Heart className="w-4 h-4 text-gray-600" />
                                </Suspense>
                            </Button>
                        </div>
                        <CardContent>
                            <div className="p-2">
                                <h2 className="text-xl font-bold">{property.price} {property.currency} | {property.bedrooms} bds | {property.bathrooms} ba</h2>
                                <p className="text-gray-600 text-sm mt-1">{property.propertyType} | {property.address} {property.country}</p>
                                <div className="w-full mt-4">
                                    {/* {property.prices.map((price: any, index: number) => ( */}
                                    <div className="p-2 w-full rounded-lg text-center flex flex-col items-center justify-center border">
                                        <p className="text-sm font-medium">{property.price} {property.currency}</p>
                                        <p className="text-sm text-gray-500">{property.bedrooms} bds | {property.bathrooms} ba</p>
                                    </div>
                                    {/* ))} */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RentalListings;
