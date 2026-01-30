import { MachineData } from "@/lib/data-loader";

export function MachineLandingView({ machine, locale }: { machine: MachineData, locale: string }) {
    return (
        <main className="min-h-screen bg-slate-50 p-10">
            <h1 className="text-4xl font-bold">{machine.brand} {machine.model}</h1>
            <p className="text-xl text-slate-500">{machine.category}</p>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Compatible Parts</h2>
                <ul>
                    {machine.compatibleParts.map(p => (
                        <li key={p.id}>{p.partNumber} - {p.name}</li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
