import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
export function CardWithForm() {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Request a Tour</CardTitle>
                <CardDescription>Request a tour of the property.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Request a Tour</Button>
            </CardFooter>
        </Card>
    )
}
