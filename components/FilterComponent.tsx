"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function FilterComponent({ selectedFilter, setSelectedFilter }: { selectedFilter: string | null, setSelectedFilter: (filter: string | null) => void }) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedFilter || "Sort: Properties for You"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedFilter || undefined} onValueChange={setSelectedFilter}>
          <DropdownMenuRadioItem value="Price High to Low">
            Price High to Low
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Price Low to High">
            Price Low to High
          </DropdownMenuRadioItem>
          {/* <DropdownMenuRadioItem value="Beds">
            Beds
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Baths">
            Baths
          </DropdownMenuRadioItem> */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
