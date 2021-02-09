import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector } from 'react-redux';
import { selectDates } from '../store/postDates';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DatePicker from './DatePicker';
import Typography from '@material-ui/core/Typography';
import DatepickerRangeIcon from '../icons/DatepickerRangeIcon';
import IconButtonStateful from './IconButtonStateful';


function FilterByDate({
    startDate,
    endDate,
    onChange
}) {
    //
    // highlighted dates
    //
    const datesWithPosts = useSelector(selectDates);
    const highlightedDates = useMemo(() => datesWithPosts.map(d => (new Date(d))), [datesWithPosts]);

    //
    // buffer for startDate when range enabled
    //
    const [datesBuffer, setDatesBuffer] = useState({
        start: startDate,
        end: endDate
    });
    useEffect(() => {
        setDatesBuffer({
            start: startDate,
            end: endDate
        });
    }, [setDatesBuffer, startDate, endDate]);

    //
    // range mode
    //
    const [rangeMode, setRangeMode] = useState(false);

    //
    // handlers
    //
    const handleClear = useCallback(() => {
        onChange(null, null);
    }, [onChange]);

    const handleChange = useCallback(dates => {
        if (rangeMode) {
            const [start, end] = dates;

            if (end) {
                onChange(start, end);
            } else {
                setDatesBuffer({start, end});
            }

        } else {
            onChange(dates, null);
        }

    }, [rangeMode, onChange]);

    const handleToggleRange = useCallback(() => {
        setRangeMode(r => !r);
    }, [setRangeMode]);



    return (<>
        <div className="d-flex align-items-center justify-content-between mb-1">
            <IconButtonStateful
                color="inherit"
                onClick={handleToggleRange}
                size="small"
                isActive={rangeMode}
            >
                <DatepickerRangeIcon />
            </IconButtonStateful>

            <div className="flex-grow-1 text-align_center">
                <Typography variant="h4">Дата</Typography>
            </div>

            <div className="icon-placeholder_def-sm">
                {startDate &&
                    <IconButton
                        color="inherit"
                        onClick={handleClear}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                }
            </div>
        </div>

        <div className="container_max-sm container_center">
            <DatePicker
                selected={datesBuffer.start}
                startDate={datesBuffer.start}
                endDate={datesBuffer.end}
                onChange={handleChange}
                selectsRange={rangeMode}
                highlightDates={highlightedDates}
            />
        </div>
    </>);
}

export default React.memo(FilterByDate);