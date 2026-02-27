import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductGridSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="space-y-2 px-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
