import React from 'react';

import css from './Search.module.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import useValueBuffer from '../hooks/useValueBuffer';

const MIN_LENGTH = 2;


function Search({ value, onChange }) {
    const [buffer, updateBuffer] = useValueBuffer(value, onChange, 1000);

    // handlers
    const handleChange = e => {
        updateBuffer(
            e.target.value,
            v => v.length === 0 || v.length >= MIN_LENGTH
        );
    };


    return (<>
        <OutlinedInput
            value={buffer}
            onChange={handleChange}
            fullWidth
            inputProps={{
                className: css.input
            }}
            className={css.root}
            placeholder="Поиск"
            endAdornment={
                <InputAdornment position="end">
                    {buffer.length > 0 && (
                        <IconButton onClick={() => onChange('')} edge="end">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </InputAdornment>
            }
        />

    </>);
}

export default React.memo(Search);