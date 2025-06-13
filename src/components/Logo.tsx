import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
    const sizes = {
        sm: 'h-10',
        md: 'h-14',
        lg: 'h-20'
    };

    return (
        <Link to="/" className={`flex items-center ${className}`}>
            <img
                src="/logo.png"
                alt="Kisan Markaz"
                className={`${sizes[size]} w-auto`}
            />
        </Link>
    );
};

export default Logo; 