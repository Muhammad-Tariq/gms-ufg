import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  title: string;
  isLink?: boolean;
  link?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  isLink = false,
  link
}) => {
  if (isLink) {
    return (
      <Link to={link ?? '/'} className="block py-2 px-4 w-full text-left rounded-md bg-gray-100 hover:bg-gray-300 mt-2">
        {title}
      </Link>
    );
  }
  return (
    <button type="button" className="block py-2 px-4 w-full text-left rounded-md bg-gray-100 hover:bg-gray-300 mt-2">
      {title}
    </button>
  );
};

export default Button;