
import React from "react"
import { Button } from "@/components/ui/button"


import Logo from "@/components/Logo/Logo"
import { Tornado } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import Toggle from "@/components/themes/Toggle";


// Header: logo, nav links, theme toggle, auth buttons
export default function Header() {
    


    return (
        <header className="sticky top-0 z-50  backdrop-blur-sm border-b border-primary/20">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                {/* logo */}
                <Logo />


                {/* Navbar Desktop */}
                <nav className="hidden md:flex gap-8 text-sm ">
                    <a href="#features" className="hover:text-primary">Features</a>
                    <a href="#pricing" className="hover:text-primary">Pricing</a>
                    <a href="#support" className="hover:text-primary">Support</a>
                </nav>


                {/* actions */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden md:inline-flex "><Link href={'/auth/login'}>Log In</Link></Button>
                    <Button className=""><Link href={'/auth/signup'}>Sign Up</Link></Button>


                    {/* theme toggle */}
                    <Toggle />
                    {/* mobile menu */}
                    <nav className="flex md:hidden">
                        <Sheet>
                            <SheetTrigger><Tornado /></SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                    <SheetDescription>
                                        <div className="links flex flex-col gap-4 mt-4 text-sm ">
                                            <a href="#features" className="hover:text-primary">Features</a>
                                            <a href="#pricing" className="hover:text-primary">Pricing</a>
                                            <a href="#support" className="hover:text-primary">Support</a>
                                            <Button variant="ghost" className="w-max shadow-black  shadow-2xl "><Link href={'/auth/login'}>Log In</Link></Button>
                                        </div>
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </nav>
                </div>
            </div>
        </header>
    )
}