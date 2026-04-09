import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProfessionalCard({ professional, showHire, onHire }) {
    const navigate = useNavigate();
    const { id, name, category, avatar, rating, reviews, location, experience, price, available, verified } = professional;

    return (
        <div className="card group cursor-pointer" onClick={() => navigate(`/user/professional/${id}`)}>
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-2xl object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                        {verified && (
                            <span className="badge-green text-[10px] px-1.5 py-0.5">✓ Verified</span>
                        )}
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-0.5">{category}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <StarRating value={rating} readonly size="sm" />
                        <span className="text-xs text-gray-500 ml-1">{rating} ({reviews})</span>
                    </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${available ? 'bg-green-500' : 'bg-gray-300'}`} title={available ? 'Available' : 'Busy'} />
            </div>

            {/* Details */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                <span>📍 {location}</span>
                <span>⏱ {experience}</span>
                <span className="font-semibold text-gray-700">{price}</span>
            </div>

            {/* Actions */}
            {showHire && (
                <button
                    className="btn-primary w-full text-sm py-2 mt-1"
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
