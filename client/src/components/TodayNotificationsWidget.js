import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';



function TodayNotificationsWidget() {
    return (
        <IconButton color="inherit" className="mr-2">
            <CalendarTodayRoundedIcon fontSize="small" />
        </IconButton>
    );
}


export default React.memo(TodayNotificationsWidget);