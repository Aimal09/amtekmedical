import React from 'react';

const ConsentButton = ({ title, description, patientName, onClick }) => {
  const handleClick = () => {
    const finalText = description.replace('____________', patientName || '____________');
    onClick(finalText);
  };

  return (
    <button className="butn-sec mt-4 mr-4" onClick={handleClick}>
      {title}
    </button>
  );
};

export default ConsentButton;
