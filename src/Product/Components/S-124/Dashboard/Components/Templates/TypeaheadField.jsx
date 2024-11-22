import React from 'react';
import { Form, FloatingLabel, Stack } from 'react-bootstrap';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

const TypeaheadField = ({
    id,
    label,
    options,
    placeholder,
    selected,
    onChange,
    labelKey = 'label',
    isInvalid,
    isValid,
    ...rest
}) => {
    const inputClassName = isInvalid ? 'is-invalid' : isValid ? 'is-valid' : '';
    return (
        <Typeahead
            clearButton
            id={id}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            labelKey={labelKey}
            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                <Hint>
                    <FloatingLabel controlId={id}>
                        <Form.Control
                            {...inputProps}
                            ref={(node) => {
                                inputRef(node);
                                referenceElementRef(node);
                            }}
                            className={inputClassName}
                        />
                        <label htmlFor={id}>
                            <Stack direction="horizontal">
                                <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {label}
                                </label>
                                <span className="text-danger"> *</span>
                            </Stack>
                        </label>
                    </FloatingLabel>
                </Hint>
            )}
            selected={selected}
            {...rest}
        />
    );
};

export default TypeaheadField;