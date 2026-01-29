'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50 text-red-900">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <div className="bg-white p-6 rounded shadow-md border border-red-200 max-w-lg w-full overflow-auto">
                <p className="font-mono text-sm mb-4 whitespace-pre-wrap text-red-600">
                    {error.message || "Unknown Error"}
                </p>
                {error.digest && (
                    <p className="text-xs text-slate-500 mb-4">Digest: {error.digest}</p>
                )}
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
