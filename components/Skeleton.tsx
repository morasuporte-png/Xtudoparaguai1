import React from 'react';
import { cn } from '../services/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-800/50", className)}
            {...props}
        />
    );
};
