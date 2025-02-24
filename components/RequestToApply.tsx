import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
const RequestToApply = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="flex-1">Request to apply</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request to apply</DialogTitle>
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
                    <Button type="submit">Request to apply</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RequestToApply;