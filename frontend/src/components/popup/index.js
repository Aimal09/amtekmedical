import React, { ReactNode } from "react";
import "./popup.css";


const Popup = ({
  children,
  buttonText,
  title,
  onButtonClick,
  onPopupClose,
}) => {
  const handleOutsideClose = (e) => {
    e.target === e.currentTarget && onPopupClose();
  };
  return (
    <>
      <div className="popup-main" onClick={(e) => handleOutsideClose(e)}>
        <div className="popup">
          <div className="popup-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">{title}</h5>
            <div className="times" onClick={onPopupClose}>
                <i className="fas fa-times"></i>
            </div>
          </div>

          <div className="popup-content mb-3">{children}</div>

          <div className="popup-footer">
            {buttonText&&<button className="butn w-100" onClick={onButtonClick}>
              {buttonText}
            </button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
