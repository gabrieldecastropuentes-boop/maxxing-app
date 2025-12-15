interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function BackButton({ onClick, disabled = false, className = '' }: BackButtonProps) {
  if (disabled) return <div className="w-10" />; // Spacer

  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
      aria-label="Voltar"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

