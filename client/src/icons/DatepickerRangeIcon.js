import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

function DatepickerRangeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M9.49,5.89a3.6,3.6,0,1,1-3.6-3.6A3.6,3.6,0,0,1,9.49,5.89ZM21.71,18.11a3.6,3.6,0,1,1-3.6-3.6A3.6,3.6,0,0,1,21.71,18.11Zm-6.46-12A2.1,2.1,0,1,1,13.15,4,2.1,2.1,0,0,1,15.25,6.09Zm5.31,0A2.1,2.1,0,1,1,18.46,4,2.1,2.1,0,0,1,20.56,6.09ZM13,18.11a2.1,2.1,0,1,1-2.1-2.1A2.1,2.1,0,0,1,13,18.11Zm-5.31,0A2.1,2.1,0,1,1,5.54,16,2.1,2.1,0,0,1,7.64,18.11Z" />
        </SvgIcon>
    );
}
export default React.memo(DatepickerRangeIcon);