'use client'

interface StarRatingProps {
  value: 1 | 2 | 3 | 4 | 5
  max?: number
  size?: number
}

export default function StarRating({ value, max = 5, size = 12 }: StarRatingProps) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < value ? '#FAAD14' : 'none'}
          stroke={i < value ? '#FAAD14' : 'rgba(0,0,0,0.25)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
        </svg>
      ))}
    </span>
  )
}
