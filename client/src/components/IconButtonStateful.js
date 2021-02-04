import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import { styled } from '@material-ui/core/styles';

const IconButtonStateful = styled(
    ({ isActive, ...otherProps }) => <IconButton {...otherProps} />
)
(
    ({ theme, isActive }) => (isActive && {
        background: [theme.palette.primary.main, '!important'],
        color: '#fff'
    })
);

export default React.memo(IconButtonStateful);