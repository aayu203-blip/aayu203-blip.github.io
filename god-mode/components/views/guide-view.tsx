import { GuideData } from "@/lib/data-loader";

export function GuideView({ guide, locale }: { guide: GuideData, locale: string }) {
    return (
        <main className="min-h-screen bg-white p-10 max-w-4xl mx-auto prose">
            <h1>{guide.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: guide.content }} />
        </main>
    );
}
