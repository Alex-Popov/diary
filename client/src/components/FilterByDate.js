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
    onChangeStartDate,
    endDate,
    onChangeEndDate,
}) {
    //
    // highlighted dates
    //
    const datesWithPosts = useSelector(selectDates);
    const highlightedDates = useMemo(() => datesWithPosts.map(d => (new Date(d))), [datesWithPosts]);

    //
    // buffer for startDate when range enabled
    //
    const [startDateBuffer, setStartDateBuffer] = useState(startDate);
    useEffect(() => {
        setStartDateBuffer(startDate);
    }, [setStartDateBuffer, startDate]);

    const [endDateBuffer, setEndDateBuffer] = useState(endDate);
    useEffect(() => {
        setEndDateBuffer(endDate);
    }, [setEndDateBuffer, endDate]);

    //
    // range mode
    //
    const [rangeMode, setRangeMode] = useState(false);

    //
    // handlers
    //
    const handleClear = useCallback(() => {
        onChangeStartDate(null);
        onChangeEndDate(null);
    }, [onChangeStartDate, onChangeEndDate]);

    const handleChange = useCallback(dates => {
        if (rangeMode) {
            const [start, end] = dates;
            if (end) {
                onChangeStartDate(start);
                onChangeEndDate(end);
            } else {
                setStartDateBuffer(start);
                setEndDateBuffer(end);
            }

        } else {
            onChangeStartDate(dates);
        }

    }, [rangeMode, onChangeStartDate, onChangeEndDate]);

    const handleToggleRange = useCallback(() => {
        setRangeMode(r => !r);
        onChangeEndDate(null);
    }, [setRangeMode, onChangeEndDate]);



    return (<>
        <div className="d-flex align-items-center justify-content-between mb-2">
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
                        disableRipple
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
                selected={startDateBuffer}
                startDate={startDateBuffer}
                endDate={endDateBuffer}
                onChange={handleChange}
                selectsRange={rangeMode}
                highlightDates={highlightedDates}
            />
        </div>
    </>);
}

export default React.memo(FilterByDate);