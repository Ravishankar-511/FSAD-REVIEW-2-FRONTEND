import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProfessionalCard({ professional, showHire, onHire }) {
    const navigate = useNavigate();
    const { id, name, category, avatar, rating, reviews, location, experience, price, available, verified } = professional;

    return (
        <div className="card group cursor-pointer" onClick={() => navigate(`/user/professional/${id}`)}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-800 truncate text-lg">{name}</h3>
                        {verified && (
                            <span className="badge-green text-xs px-2 py-1">✓ Verified</span>
                        )}
                    </div>
                    <p className="text-sm text-indigo-600 font-semibold">{category}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <StarRating value={rating} readonly size="sm" />
                        <span className="text-sm text-slate-600">{rating} ({reviews})</span>
                    </div>
                </div>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-2 ${available ? 'bg-green-500' : 'bg-gray-300'} shadow-sm`} title={available ? 'Available' : 'Busy'} />
            </div>

            {/* Details */}
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 flex-wrap">
                <span>📍 {location}</span>
                <span>⏱ {experience}</span>
                <span className="font-bold text-slate-800 ml-auto">{price}</span>
            </div>

            {/* Actions */}
            {showHire && (
                <button
                    className="btn-primary w-full text-sm py-3 mt-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onHire?.();
                    }}
                >
                    Hire Now
                </button>
            )}
        </div>
    );
}
