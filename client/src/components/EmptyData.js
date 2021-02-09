import React from 'react';
import Typography from '@material-ui/core/Typography';

function EmptyData(props) {
    return (
        <Typography
            component="div"
            variant="overline"
            className="text-align_center py-2 px-1"
        >{props.children}</Typography>
    );
}

export default React.memo(EmptyData);