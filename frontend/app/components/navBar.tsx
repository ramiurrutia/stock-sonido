"use client"

import SearchBar from "./search/searchBar";

export default function Header() {
    return <nav className="flex flex-row items-center px-4 py-4 fixed top-0 z-40 w-screen justify-center">
        <SearchBar />
    </nav>
}