"use client"

import SearchBar from "./searchBar";
import User from "./user";

export default function Header() {
    return <nav className="flex flex-row items-center py-2 fixed top-0 z-40 w-screen justify-center backdrop-blur-sm border-b border-zinc-900">
        <SearchBar />
        <User />
    </nav>
}