"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

interface SearchResult {
    id: number;
    brand: string;
    part_number: string;
    product_name: string;
    display_name: string; // Add this
    slug: string;
}

export function SearchCommand() {

    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (query.length === 0) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setResults(data.results)
            } catch (e) {
                console.error("Search failed", e)
            } finally {
                setLoading(false)
            }
        }, 200) // Reduced debounce for faster feel

        return () => clearTimeout(timer)
    }, [query])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-14 w-full justify-start border-2 border-border bg-background px-4 text-lg text-muted-foreground shadow-none sm:pr-12 md:w-96 lg:w-[600px] xl:w-[800px]"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search Part Number... (e.g. 1521725, Vovlo Fitler)</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-2.5 top-3.5 hidden h-7 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a part number, brand, or even with typos..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                    {!loading && results.length === 0 && query.length > 0 && (
                        <CommandEmpty>No parts found. Try different keywords.</CommandEmpty>
                    )}
                    {!loading && results.length > 0 && (
                        <CommandGroup heading={`${results.length} Results`}>
                            {results.map((part) => (
                                <CommandItem
                                    key={part.id}
                                    value={`${part.part_number} ${part.brand} ${part.product_name}`}
                                    onSelect={() => {
                                        runCommand(() => router.push(`/product/${part.slug}`))
                                    }}
                                    className="flex items-center justify-between p-3"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-primary">{part.part_number}</span>
                                        <span className="text-sm font-semibold">{part.brand}</span>
                                        <span className="text-xs text-muted-foreground">{part.display_name}</span>
                                    </div>
                                    <Search className="ml-2 h-4 w-4 opacity-50" />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
