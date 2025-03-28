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
    const handleSubmit = async (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.currentTarget.closest('form');
        if (!formElement) {
            console.error('Form element not found');
            return;
        }

        const formData = new FormData(formElement);
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            message: formData.get('message'),
            reason: 'forApply'
        };

        try {
            const response = await fetch('/api/save_query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save query');
            }

            // Close the dialog or handle success
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="flex-1">Request to apply</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request to apply</DialogTitle>
                    <DialogDescription>
                    Provide your information and we will contact you.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">First Name</Label>
                            <Input id="name" name="first_name" placeholder="First Name" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input id="lastname" name="last_name" placeholder="Last Name" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="Email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Message" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit}>Request to apply</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default RequestToApply;