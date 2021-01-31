import React, {useEffect, useState, useRef} from 'react';

import css from './Search.module.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const MIN_LENGTH = 3;


function Search({ value, onChange }) {

    //
    // buffer for timeout
    //
    const [valueBuffer, setValueBuffer] = useState(value);
    useEffect(() => {
        setValueBuffer(value);
    }, [setValueBuffer, value]);

    const timeoutIdRef = useRef(0);


    // handlers
    const handleChange = e => {
        const newValueBuffer = e.target.value;

        setValueBuffer(newValueBuffer);

        clearInterval(timeoutIdRef.current);
        if (newValueBuffer.length >= MIN_LENGTH) {
            timeoutIdRef.current = setTimeout(() => {
                onChange(newValueBuffer);
            }, 700);
        }
    };


    return (<>
        <OutlinedInput
            value={valueBuffer}
            onChange={handleChange}
            fullWidth
            inputProps={{
                className: css.input
            }}
            placeholder="Поиск"
            endAdornment={
                <InputAdornment position="end">
                    {!!valueBuffer && (
                        <IconButton onClick={() => onChange('')}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </InputAdornment>
            }
        />

    </>);
}

export default React.memo(Search);