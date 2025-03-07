"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GoogleMap from "@/app/properties/components/property-card-components/GoogleMap";
import RequestATour from "@/components/RequestATour";
import RequestToApplytsx from "@/components/RequestToApply";

type DialogContentCardProps = {
    property: any;
    showAllPhotos: boolean;
    setShowAllPhotos: (showAllPhotos: boolean) => void;
    handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    isSavingOrDeleting: boolean;
}
const DialogContentCard = ({
    property,
    showAllPhotos,
    setShowAllPhotos,
    handleSaveProperty,
    handleDeleteProperty,
    isSavingOrDeleting
}: DialogContentCardProps) => {
    return (
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
                        <Button variant="outline" onClick={(event) => handleSaveProperty(event, property)} className="text-md font-semibold mt-2 cursor-pointer"><BookmarkIcon /></Button>
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
    );
};

export default DialogContentCard;