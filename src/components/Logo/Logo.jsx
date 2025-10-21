import React from 'react'

export default function Logo() {
  return (
            <div className="flex items-center gap-2">
          <svg
            className="h-8 w-8"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="text-xl font-bold tracking-tight">Transfer</h2>
        </div>
  )
}
