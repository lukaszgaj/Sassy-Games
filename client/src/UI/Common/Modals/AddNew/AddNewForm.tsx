import React from 'react';
import {Form, FormGroup, InputGroup} from 'react-bootstrap';
import {ModalFormField} from './ModalFormField';

export function AddNewForm(props: {
    fields?: ModalFormField[]
    values: string[]
    setValues: (e: string[]) => void;
}) {
    return (
        <Form>
            {props.fields?.map((field, index) => {
                return (
                    <FormGroup key={field.label}>
                        <InputGroup>
                            <Form.Control
                                type={field.type}
                                id={field.label}
                                placeholder={field.label}
                                value={props.values[index] || ''}
                                onChange={e => {
                                    const clone = [...props.values];
                                    clone[index] = e.target.value;
                                    props.setValues(clone);
                                }}
                                required/>
                        </InputGroup>
                    </FormGroup>
                );
            })}
        </Form>
    );
}