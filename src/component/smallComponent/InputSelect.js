import React from 'react';
import { selectStyles, optionBg } from '../../Styles/HeadingStyle/InputSelectStyle';

const InputSelect = ({ data, name, selectedValue, onSelectChange }) => {
    const handleChange = (event) => {
        const { value } = event.target;
        onSelectChange(name, value);
    };

    return (
        <div>
            <select name={name} value={selectedValue} style={{ ...selectStyles }} onChange={handleChange}>
                <option value="" style={{ ...optionBg }}>{name}</option>
                {data?.map((item, index) => (
                    <option key={index} value={item} style={{ ...optionBg }}>{item}</option>
                ))}
            </select>
        </div>
    );
}

export default InputSelect;
