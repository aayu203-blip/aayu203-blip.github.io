"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, X, TrendingDown, Shield, Zap, DollarSign } from "lucide-react"

export function ComparisonTool() {
    const [selectedType, setSelectedType] = React.useState<'oem' | 'aftermarket'>('oem')

    return (
        <Card className="rounded-none border-4 border-primary">
            <CardHeader className="bg-primary text-primary-foreground border-b-4 border-black">
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                    OEM vs Aftermarket Comparison
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-4 divide-border">

                    {/* OEM COLUMN */}
                    <div
                        className={`p-6 cursor-pointer transition-all ${selectedType === 'oem' ? 'bg-primary/10' : 'hover:bg-muted/20'}`}
                        onClick={() => setSelectedType('oem')}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black uppercase">OEM Parts</h3>
                            {selectedType === 'oem' && <CheckCircle className="h-6 w-6 text-primary" />}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Factory Warranty</p>
                                    <p className="text-sm text-muted-foreground">Full manufacturer backing</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Guaranteed Fit</p>
                                    <p className="text-sm text-muted-foreground">100% compatibility</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <DollarSign className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Premium Price</p>
                                    <p className="text-sm text-muted-foreground">2-3x aftermarket cost</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-muted/50 p-4 rounded-none border-2">
                                <p className="text-xs font-mono text-muted-foreground mb-2">TYPICAL PRICE</p>
                                <p className="text-3xl font-black">₹15,000</p>
                            </div>

                            <Button
                                className="w-full h-12 rounded-none border-2 font-bold"
                                variant={selectedType === 'oem' ? 'default' : 'outline'}
                            >
                                REQUEST OEM QUOTE
                            </Button>
                        </div>
                    </div>

                    {/* AFTERMARKET COLUMN */}
                    <div
                        className={`p-6 cursor-pointer transition-all ${selectedType === 'aftermarket' ? 'bg-primary/10' : 'hover:bg-muted/20'}`}
                        onClick={() => setSelectedType('aftermarket')}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black uppercase">Aftermarket</h3>
                            {selectedType === 'aftermarket' && <CheckCircle className="h-6 w-6 text-primary" />}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <TrendingDown className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Cost Savings</p>
                                    <p className="text-sm text-muted-foreground">40-60% cheaper than OEM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Faster Availability</p>
                                    <p className="text-sm text-muted-foreground">Usually in stock</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Quality Varies</p>
                                    <p className="text-sm text-muted-foreground">Choose certified brands</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-muted/50 p-4 rounded-none border-2">
                                <p className="text-xs font-mono text-muted-foreground mb-2">TYPICAL PRICE</p>
                                <p className="text-3xl font-black text-green-600">₹6,500</p>
                                <Badge variant="secondary" className="mt-2 font-mono">SAVE ₹8,500</Badge>
                            </div>

                            <Button
                                className="w-full h-12 rounded-none border-2 font-bold bg-primary text-black hover:bg-primary/90"
                                variant={selectedType === 'aftermarket' ? 'default' : 'outline'}
                            >
                                REQUEST AFTERMARKET QUOTE
                            </Button>
                        </div>
                    </div>

                </div>

                {/* RECOMMENDATION */}
                <div className="p-6 bg-muted/30 border-t-4 border-border">
                    <p className="text-sm text-center font-mono">
                        <strong>Our Recommendation:</strong> For critical components (engine, transmission), choose OEM.
                        For wear items (filters, belts), aftermarket offers excellent value.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
