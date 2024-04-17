import React from 'react';

interface HeaderProps {
  title: string;
  actions: React.ReactNode;
};

function Header({ title, actions }:HeaderProps) {
  return (
    <div className="header">
      <h1 className='heading' id="main-head">{title}</h1>
      <div className="header-actions">
        {actions}
      </div>
    </div>
  );
};

export default Header;
