interface RCNRMountainLogoProps {
  href?: string
  className?: string
}

function RCNRMountainLogo({
  href = 'https://teacher.rcnr.net',
  className = '',
}: RCNRMountainLogoProps) {
  return (
    <a
      href={href}
      className={`flex items-center justify-center w-10 h-10 rounded-lg bg-brand/10 hover:bg-brand/20 transition-colors ${className}`}
      title="Back to Dashboard"
    >
      <svg
        width="28"
        height="24"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10,90l26.48-39.76h.31s4.54,5.02,4.54,5.02l.32-.16,23.06-37.14,17.34,28.63,3.65-4.61,30.22,48.03h-8.43c-7.17-12.26-15.51-24.35-23.06-36.26-1.43.52-2.03,3.6-3.49,3.97l-16.31-25.93-21.87,34.36-5.09-5.01-19.48,28.87h-8.19Z"
          fill="#99D9D9"
        />
        <path
          d="M89.84,90h-5.73c-6.34-8.18-12.93-16.89-19.64-24.65-6.66,8.19-13.04,16.6-19.89,24.65h-5.81l25.69-39.76,25.37,39.76Z"
          fill="#99D9D9"
        />
      </svg>
    </a>
  )
}

export default RCNRMountainLogo
