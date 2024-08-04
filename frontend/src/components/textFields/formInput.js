import React from 'react';
import PropTypes from 'prop-types';
import './formInput.css'

const FormInput = ({ label, inputType, placeholder, inputValue, id, onInputChange, className }) => {
    return (
        <div className={"input-with-label " + (className || "")}>
            {label && <label>{label}</label>}
            <input
                type={inputType || 'text'}
                placeholder={placeholder || undefined}
                value={inputValue || undefined}
                id={id || undefined}
                onChange={onInputChange}
            />
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string,
    inputType: PropTypes.string,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    id: PropTypes.string,
};


export default FormInput;