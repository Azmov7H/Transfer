import React from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"





export default function Body() {
    return (
        <div className="p-4 mt-3">
           <TableHead>Reaction Trnsform</TableHead>
            <Table>
               
                {/*Header of Table*/}

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">ID Trnsform </TableHead>
                        <TableHead>Reacfore</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead> Stete</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {/*Body of Table*/}

                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">
                        
                            #7647986
                            </TableCell>
                        <TableCell>ali</TableCell>
                        <TableCell>250$</TableCell>
                        <TableCell>Complete</TableCell>
                        <TableCell>12/12/2024</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:underline">Edit</button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
