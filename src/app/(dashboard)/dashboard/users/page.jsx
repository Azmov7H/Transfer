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




export default function Page() {
    return (
        <div className="p-4">
            <Table>
                <TableCaption>List of registered users.</TableCaption>
                {/*Header of Table*/}

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {/*Body of Table*/}

                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">
                            <Avatar>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            Ali
                            </TableCell>
                        <TableCell>ali@a.com</TableCell>
                        <TableCell>2/1/2025</TableCell>
                        <TableCell>20/10/2025</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:underline">Edit</button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Ali</TableCell>
                        <TableCell>ali@a.com</TableCell>
                        <TableCell>2/1/2025</TableCell>
                        <TableCell>20/10/2025</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:underline">Edit</button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Ali</TableCell>
                        <TableCell>ali@a.com</TableCell>
                        <TableCell>2/1/2025</TableCell>
                        <TableCell>20/10/2025</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:underline">Edit</button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Ali</TableCell>
                        <TableCell>ali@a.com</TableCell>
                        <TableCell>2/1/2025</TableCell>
                        <TableCell>20/10/2025</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:underline">Edit</button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
