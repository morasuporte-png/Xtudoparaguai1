import React from 'react';

interface BreadcrumbItem {
    label: string;
    hash?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 overflow-x-auto scrollbar-hide py-2">
            <button
                onClick={() => { window.location.hash = '#marketplace'; }}
                className="hover:text-indigo-600 transition-colors flex-shrink-0"
            >
                Início
            </button>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="opacity-40 select-none">/</span>
                    {item.hash ? (
                        <button
                            onClick={() => { window.location.hash = item.hash!; }}
                            className={`hover:text-indigo-600 transition-colors flex-shrink-0 ${index === items.length - 1 ? 'text-slate-900' : ''
                                }`}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className={`flex-shrink-0 ${index === items.length - 1 ? 'text-slate-900 border-b-2 border-indigo-500/30' : ''}`}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
