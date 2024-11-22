import React from 'react';
import { Form, FloatingLabel, Stack } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

const TypeaheadComboxField = ({
    id,
    label,
    options,
    placeholder,
    selected,
    onChange,
    isInvalid,
    isValid,
    ...rest
}) => {
    const inputClassName = isInvalid ? 'is-invalid' : isValid ? 'is-valid' : '';

    const handleSelectionChange = (selectedOptions) => {
        onChange(selectedOptions);
    };

    return (
        <Typeahead
            clearButton
            id={id}
            onChange={handleSelectionChange}
            options={options}
            placeholder={placeholder}
            selected={selected}
            multiple
            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                <FloatingLabel controlId={id}>
                    <Form.Control
                        {...inputProps}
                        ref={(node) => {
                            inputRef(node);
                            referenceElementRef(node);
                        }}
                        className={inputClassName}
                        value={selected.join(', ')}
                        readOnly
                    />
                    <label htmlFor={id}>
                        <Stack direction="horizontal">
                            <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {label}
                            </label>
                        </Stack>
                    </label>
                </FloatingLabel>
            )}
            {...rest}
        />
    );
};

export default TypeaheadComboxField;
