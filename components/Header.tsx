
import React from 'react';
import { TerraformIcon } from './icons/TerraformIcon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 border-b border-gray-700">
      <TerraformIcon className="w-8 h-8 text-cyan-400" />
      <h1 className="ml-3 text-2xl font-bold text-gray-100">Terraform AWS Learner</h1>
    </header>
  );
};

export default Header;
