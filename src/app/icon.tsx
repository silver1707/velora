import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b', // background color matching the dark theme
          borderRadius: '16px',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          width="48"
          height="48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 50L14 14H24L32 34L40 14H50L32 50Z"
            fill="#a78bfa" // lilac-strong approximation for OG image
          />
          <path
            d="M32 50L40 14H50L32 50Z"
            fill="#f43f5e" // rose approximation
            opacity="0.9"
          />
          <circle cx="32" cy="50" r="3" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
