import { Card, CardContent } from "@/components/ui/card";
import PropertyCardHeader from "./PropertyCardHeader";
import { Bed, Bath } from "lucide-react";
import RequestATour from "@/components/RequestATour";

type DialogHeaderCardProps = {
    property: any;
    isSaved: boolean;
    handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    isSavingOrDeleting: boolean;
}
const DialogHeaderCard = ({
    property,
    isSaved,
    handleSaveProperty,
    handleDeleteProperty,
    isSavingOrDeleting
}: DialogHeaderCardProps) => {
    return (
        <Card className="relative cursor-pointer p-0 gap-2">
            <PropertyCardHeader
                property={property}
                isSaved={isSaved}
                handleSaveProperty={handleSaveProperty}
                handleDeleteProperty={handleDeleteProperty}
                isSavingOrDeleting={isSavingOrDeleting}
            />
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
    );
};

export default DialogHeaderCard;