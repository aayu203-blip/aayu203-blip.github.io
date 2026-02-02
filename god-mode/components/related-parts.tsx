'use client'

import { Part, slugify } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function RelatedParts({ currentPart, allParts }: {
    currentPart: Part
    allParts: Part[]
}) {
    // Find parts in same category or same brand
    const related = allParts
        .filter(p => {
            if (p.id === currentPart.id) return false

            // Prioritize same category
            if (p.category === currentPart.category) return true

            // Then same brand
            if (p.brand === currentPart.brand) return true

            return false
        })
        .slice(0, 6)

    if (related.length === 0) return null

    return (
        <section className="mt-12 pt-8 border-t-2 border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Related Parts</h3>
                <Link
                    href={`/search?q=${currentPart.brand}`}
                    className="text-sm text-[#005EB8] hover:underline flex items-center gap-1"
                >
                    View all {currentPart.brand} parts
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {related.map(part => (
                    <Link
                        key={part.id}
                        href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`}
                        className="border border-slate-200 p-4 hover:border-[#005EB8] hover:shadow-md transition-all bg-white group"
                    >
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{part.brand}</div>
                        <div className="font-mono font-bold text-slate-900 mb-2 group-hover:text-[#005EB8] transition-colors">
                            {part.partNumber}
                        </div>
                        <div className="text-sm text-slate-600 line-clamp-2">{part.name}</div>

                        {part.technical_specs && Object.keys(part.technical_specs).length > 0 && (
                            <div className="mt-2 text-xs text-emerald-600 font-semibold">
                                ✓ Full Specs Available
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    )
}
