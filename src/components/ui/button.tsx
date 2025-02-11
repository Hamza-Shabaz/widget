import { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  ...props 
}) => {
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-xl font-medium transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-500 text-white hover:bg-gray-600',
        variant === 'default' && 'bg-white text-black border hover:bg-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};