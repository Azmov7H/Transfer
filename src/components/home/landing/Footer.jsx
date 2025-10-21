import React from "react"


export default function Footer() {
    return (
        <footer className=" border-t ">
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
                <div className="flex items-center gap-6">
                    <a href="#about">About</a>
                    <a href="#">Pricing</a>
                    <a href="#">Contact</a>
                    <a href="#">Docs</a>
                </div>
                <div className="text-sm">© 2024 Transfer. All rights reserved.</div>
            </div>
        </footer>
    )
}