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
        minPrice: toolCallArgs.min_price || toolCallArgs.rent_min_price || "Select",
        maxPrice: toolCallArgs.max_price || toolCallArgs.rent_max_price || "Select",
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

    const handleInputChange = (key: string, value: string) => {
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

    const getPriceOptions = () => {
        if (filters.rentType === "ForRent") {
            return [
                { value: "Select", label: "$0" },
                { value: "$50", label: "$50" },
                { value: "$100", label: "$100" },
                { value: "$200", label: "$200" },
                { value: "$400", label: "$400" },
                { value: "$600", label: "$600" },
                { value: "$800", label: "$800" },
                { value: "$1000", label: "$1000" },
                { value: "$1200", label: "$1200" }
            ];
        } else if (filters.rentType === "ForSale") {
            return [
                { value: "Select", label: "Any Price" },
                { value: "$5000", label: "$5000" },
                { value: "$10000", label: "$10000" },
                { value: "$20000", label: "$20000" },
                { value: "$50000", label: "$50000" },
                { value: "$100000", label: "$100000" },
                { value: "$200000", label: "$200000" },
                { value: "$300000", label: "$300000" },
                { value: "$400000", label: "$400000" },
                { value: "$500000", label: "$500000" }
            ];
        }
        return [];
    };

    React.useEffect(() => {
        setQuery(() => {
            const criteria = [];
            if (filters.rentType !== "Select") criteria.push(`Rent Type: ${filters.rentType}`);
            if (filters.homeType !== "Select") criteria.push(`Home Type: ${filters.homeType}`);
            if (filters.minPrice !== "Select" || filters.maxPrice !== "Select") {
                criteria.push(`Price Range: ${filters.minPrice} to ${filters.maxPrice}`);
            }
            if (filters.beds !== "Select") criteria.push(`Beds: ${filters.beds}`);
            if (filters.baths !== "Select") criteria.push(`Baths: ${filters.baths}`);
            if (filters.minSqft !== "Select" || filters.maxSqft !== "Select") {
                criteria.push(`Square Footage: ${filters.minSqft} to ${filters.maxSqft}`);
            }
            return `Please show me the properties that match the following criteria: ${criteria.join(', ')}`;
        });
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
                                                {getPriceOptions().map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-xs text-gray-500">Type in your min price</span>
                                        <input
                                            type="text"
                                            placeholder="Enter min price"
                                            value={filters.minPrice}
                                            onChange={(e) => handleInputChange('minPrice', e.target.value)}
                                            className="border rounded p-1"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Max Price</Label>
                                        <Select onValueChange={(value) => handleSelectChange('maxPrice', value)}>
                                            <SelectTrigger id="max">
                                                <SelectValue placeholder={filters.maxPrice} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {getPriceOptions().map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-xs text-gray-500">Type in your max price</span>
                                        <input
                                            type="text"
                                            placeholder="Enter max price"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                                            className="border rounded p-1"
                                        />
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
