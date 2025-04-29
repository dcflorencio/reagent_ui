import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DialogHeaderCard from "./DialogHeaderCard";
import DialogContentCard from "./DialogContentCard";

interface SinglePropertyCardProps {
    property: any;
    isSaved: boolean;
    handleSaveProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    handleDeleteProperty: (event: React.MouseEvent<HTMLButtonElement>, property: any) => void;
    isSavingOrDeleting: boolean;
    showAllPhotos: boolean;
    setShowAllPhotos: (showAllPhotos: boolean) => void;
}

const SinglePropertyCard: React.FC<SinglePropertyCardProps> = React.memo(({
    property,
    isSaved,
    handleSaveProperty,
    handleDeleteProperty,
    isSavingOrDeleting,
    showAllPhotos,
    setShowAllPhotos
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>
                    <DialogHeaderCard
                        property={property}
                        isSaved={isSaved}
                        handleSaveProperty={handleSaveProperty}
                        handleDeleteProperty={handleDeleteProperty}
                        isSavingOrDeleting={isSavingOrDeleting}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="w-[90%] h-[90%] max-w-none max-h-none p-4">
                <DialogHeader>
                    <DialogTitle> {property?.buildingName || property.address}</DialogTitle>
                </DialogHeader>
                <DialogContentCard
                    property={property}
                    showAllPhotos={showAllPhotos}
                    setShowAllPhotos={setShowAllPhotos}
                    handleSaveProperty={handleSaveProperty}
                    handleDeleteProperty={handleDeleteProperty}
                    isSavingOrDeleting={isSavingOrDeleting}
                />
            </DialogContent>
        </Dialog>
    );
});

SinglePropertyCard.displayName = 'SinglePropertyCard';

export default SinglePropertyCard; 