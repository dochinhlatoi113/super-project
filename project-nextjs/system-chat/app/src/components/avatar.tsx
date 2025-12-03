import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  name,
  status,
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Circle */}
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold ring-2 ring-white shadow-lg`}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <span>?</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white`}
        />
      )}
    </div>
  );
}
