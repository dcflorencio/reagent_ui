"use client"
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "@radix-ui/react-label";

const RequestATour = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsDialogOpen(true);
    };

    const handleDialogClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsDialogOpen(false);
    };

    return <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
            <Button className="w-full" onClick={handleButtonClick}>Request a Tour</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Request a Tour</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">First Name</Label>
                        <Input id="name" placeholder="First Name" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input id="lastname" placeholder="Last Name" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Email" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Message" />
                    </div>
                </div>
            </form>
            <DialogFooter>
                <Button type="submit" onClick={handleDialogClose}>Request a Tour</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
};

export default RequestATour;