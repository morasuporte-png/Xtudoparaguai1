import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: { full_name?: string; email?: string };
}

interface ReviewSectionProps {
    productId: string;
}

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
            <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className="transition-transform hover:scale-110"
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 ${s <= value ? 'text-amber-400' : 'text-slate-200'} transition-colors`}
                    viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>
        ))}
    </div>
);

const StarDisplay: React.FC<{ rating: number; small?: boolean }> = ({ rating, small }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} xmlns="http://www.w3.org/2000/svg"
                className={`${small ? 'h-3 w-3' : 'h-4 w-4'} ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
                viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [userReviewed, setUserReviewed] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('reviews')
            .select('*, profiles(full_name)')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        if (data) {
            setReviews(data);
            if (user) setUserReviewed(data.some(r => r.user_id === user.id));
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { window.location.hash = '#auth'; return; }
        if (comment.trim().length < 10) { setSubmitError('Escreva pelo menos 10 caracteres.'); return; }
        setSubmitting(true);
        setSubmitError('');
        const { error } = await supabase.from('reviews').insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment: comment.trim(),
        });
        if (error) {
            setSubmitError('Erro ao enviar avaliação. Tente novamente.');
        } else {
            setComment('');
            setRating(5);
            await fetchReviews();
        }
        setSubmitting(false);
    };

    const avg = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

    return (
        <div className="mt-12 pt-10 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">Avaliações do produto</h2>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <StarDisplay rating={avg} />
                            <span className="font-black text-slate-900">{avg.toFixed(1)}</span>
                            <span className="text-slate-400 text-sm">({reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''})</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form */}
            {!userReviewed && (
                <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-4">
                        {user ? 'Deixe sua avaliação' : 'Faça login para avaliar'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sua nota</p>
                            <StarPicker value={rating} onChange={setRating} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Comentário</p>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Conte sua experiência com este produto..."
                                rows={3}
                                disabled={!user}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none disabled:opacity-50"
                            />
                            {submitError && <p className="text-rose-500 text-xs mt-1 font-medium">{submitError}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !user}
                            onClick={!user ? () => window.location.hash = '#auth' : undefined}
                            className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 text-sm shadow-md shadow-indigo-100"
                        >
                            {!user ? 'Fazer Login para Avaliar' : submitting ? 'Enviando...' : 'Publicar Avaliação'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100" />
                                <div className="space-y-1.5">
                                    <div className="h-3 w-24 bg-slate-100 rounded-full" />
                                    <div className="h-2.5 w-16 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full mb-2" />
                            <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="font-medium">Seja o primeiro a avaliar este produto!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {reviews.map(review => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm flex-shrink-0">
                                        {(review.profiles?.full_name || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-black text-slate-900 text-sm">
                                                {review.profiles?.full_name || 'Cliente Verificado'}
                                            </p>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <StarDisplay rating={review.rating} small />
                                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
