import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { CardContent } from "./ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"

export function SelectDemo({ apiCalParameters, handleNext }: { apiCalParameters: any[], handleNext: (filteredQuery?: string) => void }) {
    const toolCallArgs = (apiCalParameters && apiCalParameters.length > 0 && 
                          apiCalParameters[apiCalParameters.length - 1].tool_calls &&
                          apiCalParameters[apiCalParameters.length - 1].tool_calls.length > 0) 
                          ? apiCalParameters[apiCalParameters.length - 1].tool_calls[apiCalParameters[apiCalParameters.length - 1].tool_calls.length - 1].args 
                          : {};
    const [filters, setFilters] = React.useState({
        rentType: toolCallArgs.status_type || "For Rent",
        homeType: toolCallArgs.home_type || "Select",
        minPrice: toolCallArgs.min_price || "Select",
        maxPrice: toolCallArgs.max_price || "Select",
        beds: toolCallArgs.beds_min || "Select",
        baths: toolCallArgs.baths_min || "Select",
        minSqft: toolCallArgs.sqft_min || "Select",
        maxSqft: toolCallArgs.sqft_max || "Select"
    });
    const [query, setQuery] = React.useState("");
    const handleSelectChange = (key: string, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    const getPriceDisplay = () => {
        const { minPrice, maxPrice } = filters;
        if (minPrice === "Select" && maxPrice === "Select") {
            return "Price";
        } else if (minPrice !== "Select" && maxPrice === "Select") {
            return `${minPrice}+`;
        } else if (minPrice === "Select" && maxPrice !== "Select") {
            return `Up to ${maxPrice}`;
        } else {
            return `${minPrice} to ${maxPrice}`;
        }
    };

    const getBedsBathsDisplay = () => {
        const { beds, baths } = filters;
        if (beds === "Select" && baths === "Select") {
            return "Beds & Baths";
        } else if (beds !== "Select" && baths === "Select") {
            return `${beds} bds`;
        } else if (beds === "Select" && baths !== "Select") {
            return `${baths} baths`;
        } else {
            return `${beds} bds, ${baths} baths`;
        }
    };

    React.useEffect(() => {
        console.log(filters);
        setQuery(`Please show me the properties that match the following criteria: Rent Type: ${filters.rentType}, Home Type: ${filters.homeType}, Price Range: ${filters.minPrice} to ${filters.maxPrice}, Beds: ${filters.beds}, Baths: ${filters.baths}, Square Footage: ${filters.minSqft} to ${filters.maxSqft}`);
    }, [filters]);
    return (
        <div className="w-full flex gap-2">
            <Select onValueChange={(value) => handleSelectChange('rentType', value)}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={filters.rentType} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        <SelectItem value="ForSale">For Sale</SelectItem>
                        <SelectItem value="ForRent">For Rent</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange('homeType', value)}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={filters.homeType} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Home Type</SelectLabel>
                        <SelectItem value="Houses">Houses</SelectItem>
                        <SelectItem value="Apartments">Apartments</SelectItem>
                        {/* <SelectItem value="Condos">Condos</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem> */}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={getPriceDisplay()} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Price</SelectLabel>
                        <CardContent>
                            <form className="w-[300px]">
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Min Price</Label>
                                        <Select onValueChange={(value) => handleSelectChange('minPrice', value)}>
                                            <SelectTrigger id="min">
                                                <SelectValue placeholder={filters.minPrice} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="Select">$0</SelectItem>
                                                <SelectItem value="$200">$200</SelectItem>
                                                <SelectItem value="$400">$400</SelectItem>
                                                <SelectItem value="$600">$600</SelectItem>
                                                <SelectItem value="$800">$800</SelectItem>
                                                <SelectItem value="$1000">$1000</SelectItem>
                                                <SelectItem value="$1200">$1200</SelectItem>
                                                <SelectItem value="$1500">$1500</SelectItem>
                                                <SelectItem value="$2000">$2000</SelectItem>
                                                <SelectItem value="$2500">$2500</SelectItem>
                                                <SelectItem value="$3000">$3000</SelectItem>
                                                <SelectItem value="$3500">$3500</SelectItem>
                                                <SelectItem value="$4000">$4000</SelectItem>
                                                <SelectItem value="$4500">$4500</SelectItem>
                                                <SelectItem value="$5000">$5000</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Max Price</Label>
                                        <Select onValueChange={(value) => handleSelectChange('maxPrice', value)}>
                                            <SelectTrigger id="max">
                                                <SelectValue placeholder={filters.maxPrice} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="$400">$400</SelectItem>
                                                <SelectItem value="$600">$600</SelectItem>
                                                <SelectItem value="$800">$800</SelectItem>
                                                <SelectItem value="$1000">$1000</SelectItem>
                                                <SelectItem value="$1200">$1200</SelectItem>
                                                <SelectItem value="$1500">$1500</SelectItem>
                                                <SelectItem value="$2000">$2000</SelectItem>
                                                <SelectItem value="$2500">$2500</SelectItem>
                                                <SelectItem value="$3000">$3000</SelectItem>
                                                <SelectItem value="$3500">$3500</SelectItem>
                                                <SelectItem value="$4000">$4000</SelectItem>
                                                <SelectItem value="Select">Any Price</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={(beds) => handleSelectChange('beds', beds)}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder={getBedsBathsDisplay()} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Beds and Baths</SelectLabel>
                        <CardContent>
                            <form className="w-[300px]">
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Beds</Label>
                                        <Select onValueChange={(beds) => handleSelectChange('beds', beds)}>
                                            <SelectTrigger id="min">
                                                <SelectValue placeholder={filters.beds} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="4">4</SelectItem>
                                                <SelectItem value="4+">4+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Baths</Label>
                                        <Select onValueChange={(value) => handleSelectChange('baths', value)}>
                                            <SelectTrigger id="max">
                                                <SelectValue placeholder={filters.baths} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="4">4</SelectItem>
                                                <SelectItem value="4+">4+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button onClick={() => handleNext(query)}>Search</Button>
        </div>
    )
}
