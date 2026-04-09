import { useState } from 'react';

export default function StarRating({ value = 0, max = 5, onChange, readonly = false, size = 'md' }) {
    const [hovered, setHovered] = useState(0);
    const sizeClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => {
                const filled = (hovered || value) > i;
                return (
                    <span
                        key={i}
                        className={`${sizeClass} transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'} ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                        onMouseEnter={() => !readonly && setHovered(i + 1)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        onClick={() => !readonly && onChange?.(i + 1)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}