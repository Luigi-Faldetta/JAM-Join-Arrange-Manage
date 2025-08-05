import React from 'react';
import { FiLoader } from 'react-icons/fi';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      gradient = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group';

    // Variant styles
    const variantStyles = {
      primary: gradient
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500'
        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500',
      secondary:
        'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl focus:ring-gray-500',
      outline:
        'border border-gray-300 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:text-purple-700 focus:ring-purple-500',
      ghost:
        'text-gray-700 hover:bg-gray-100 hover:text-purple-700 focus:ring-purple-500',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    // Icon styles
    const iconStyles = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    // Combine all classes
    const buttonClasses = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Icon spacing
    const iconSpacing = iconPosition === 'left' ? 'mr-2' : 'ml-2';
    const iconClass = `${iconStyles[size]} ${iconSpacing} ${
      loading ? '' : 'group-hover:scale-110 transition-transform duration-200'
    }`;

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <FiLoader className={`${iconStyles[size]} mr-2 animate-spin`} />
            Loading...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className={iconClass} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className={iconClass} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
