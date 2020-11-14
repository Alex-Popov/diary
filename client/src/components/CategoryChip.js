import React from 'react';
import Chip from '@material-ui/core/Chip';

import { styled } from '@material-ui/core/styles';

const CategoryChip = styled(
    ({ color, ...otherProps }) => <Chip {...otherProps} />
)(
    ({ theme, color }) => ({
        background: `linear-gradient(45deg, ${color} 10%, ${theme.palette.augmentColor({main: color}).light} 90%)`,
        color: theme.palette.getContrastText(color),
        textTransform: 'uppercase'
    })
);

export default React.memo(CategoryChip);
