import React from 'react';

interface Props {
  content: React.ReactNode;
}

function RightBar ({ content }:Props) {
  return (
    <div className="right-bar">
      {content || <div className='filler'>Nothing to display</div>}
    </div>
  );
};

export default RightBar;
