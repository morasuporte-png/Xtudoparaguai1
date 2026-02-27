
import React, { useEffect, useRef } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    transitionKey: string; // change this key to trigger animation
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, transitionKey }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = 'none';

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [transitionKey]);

    return (
        <div ref={ref} style={{ opacity: 0, transform: 'translateY(18px)' }}>
            {children}
        </div>
    );
};

export default PageTransition;
