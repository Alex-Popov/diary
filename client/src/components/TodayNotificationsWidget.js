import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';



function TodayNotificationsWidget({className}) {
    return (
        <IconButton
            color="inherit"
            size="small"
            className={className}
        >
            <CalendarTodayRoundedIcon />
        </IconButton>
    );
}


export default React.memo(TodayNotificationsWidget);