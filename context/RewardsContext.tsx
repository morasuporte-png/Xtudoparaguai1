
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

export type RewardsTier = 'Bronze' | 'Silver' | 'Gold';

export interface RewardsTransaction {
    id: string;
    date: string;
    description: string;
    points: number; // positive = earned, negative = redeemed
    orderTotal?: number;
}

interface RewardsContextType {
    points: number;
    tier: RewardsTier;
    nextTierPoints: number;
    history: RewardsTransaction[];
    addPoints: (orderTotal: number, description?: string) => number; // returns points earned
    redeemPoints: (points: number) => boolean; // returns success
    pointsToDiscount: (pts: number) => number; // R$ value
    discountToPoints: (discount: number) => number; // pts needed
    tierColor: string;
    tierBg: string;
}

const TIER_THRESHOLDS: Record<RewardsTier, number> = {
    Bronze: 0,
    Silver: 500,
    Gold: 2000,
};

const NEXT_TIER: Record<RewardsTier, number> = {
    Bronze: 500,
    Silver: 2000,
    Gold: 2000, // já está no máximo
};

export function getTier(pts: number): RewardsTier {
    if (pts >= TIER_THRESHOLDS.Gold) return 'Gold';
    if (pts >= TIER_THRESHOLDS.Silver) return 'Silver';
    return 'Bronze';
}

export const TIER_COLORS: Record<RewardsTier, { color: string; bg: string; ring: string; gradient: string }> = {
    Bronze: { color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-300', gradient: 'from-amber-600 to-orange-500' },
    Silver: { color: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-400', gradient: 'from-slate-500 to-slate-400' },
    Gold: { color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-400', gradient: 'from-yellow-500 to-amber-400' },
};

// 1 point per R$10 spent
const POINTS_PER_REAL = 0.1;
// 100 points = R$5 discount
const DISCOUNT_PER_100_PTS = 5;

const LS_KEY = 'xtudo_rewards';

function loadFromStorage(): { points: number; history: RewardsTransaction[] } {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { points: 0, history: [] };
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState<RewardsTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Load points from Supabase or localStorage
    useEffect(() => {
        const fetchPoints = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('points')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setPoints(data.points || 0);
                }
            } else {
                const saved = loadFromStorage();
                setPoints(saved.points);
                setHistory(saved.history);
            }
            setLoading(false);
        };

        fetchPoints();
    }, [user]);

    // Persist to Supabase when points change
    useEffect(() => {
        const syncPoints = async () => {
            if (user && !loading) {
                await supabase
                    .from('profiles')
                    .update({ points })
                    .eq('id', user.id);
            } else if (!user) {
                localStorage.setItem(LS_KEY, JSON.stringify({ points, history }));
            }
        };

        syncPoints();
    }, [points, user, loading, history]);

    const tier = getTier(points);
    const nextTierPoints = NEXT_TIER[tier];

    const addPoints = useCallback((orderTotal: number, description = 'Compra no marketplace') => {
        const earned = Math.floor(orderTotal * POINTS_PER_REAL);
        if (earned <= 0) return 0;
        const tx: RewardsTransaction = {
            id: `tx_${Date.now()}`,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            description,
            points: earned,
            orderTotal,
        };
        setPoints(prev => prev + earned);
        setHistory(prev => [tx, ...prev]);
        return earned;
    }, []);

    const redeemPoints = useCallback((pts: number): boolean => {
        if (pts < 100 || pts > points || pts % 100 !== 0) return false;
        const discount = (pts / 100) * DISCOUNT_PER_100_PTS;
        const tx: RewardsTransaction = {
            id: `tx_${Date.now()}`,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            description: `Resgate — desconto de R$ ${discount.toFixed(2)}`,
            points: -pts,
        };
        setPoints(prev => prev - pts);
        setHistory(prev => [tx, ...prev]);
        return true;
    }, [points]);

    const pointsToDiscount = (pts: number) => (pts / 100) * DISCOUNT_PER_100_PTS;
    const discountToPoints = (discount: number) => Math.ceil(discount / DISCOUNT_PER_100_PTS) * 100;

    const tierColors = TIER_COLORS[tier];

    return (
        <RewardsContext.Provider value={{
            points, tier, nextTierPoints, history,
            addPoints, redeemPoints,
            pointsToDiscount, discountToPoints,
            tierColor: tierColors.color,
            tierBg: tierColors.bg,
        }}>
            {children}
        </RewardsContext.Provider>
    );
};

export const useRewards = () => {
    const ctx = useContext(RewardsContext);
    if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
    return ctx;
};
