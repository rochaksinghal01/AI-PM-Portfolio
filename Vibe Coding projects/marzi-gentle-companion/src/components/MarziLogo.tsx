import marziBackground from '@/assets/marzi-bg.jpg';

interface MarziLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function MarziLogo({ size = 'md' }: MarziLogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <span className={`font-serif font-medium text-primary ${sizeClasses[size]}`}>
      Marzi
    </span>
  );
}

export { marziBackground };
