import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:bg-white/20' : '';
  
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 ${hoverClass} transition ${className}`}
    >
      {children}
    </div>
  );
}


