import React from 'react';
import Chip from '@material-ui/core/Chip';

import { styled } from '@material-ui/core/styles';

const CategoryChip = styled(
    ({ color, ...otherProps }) => <Chip {...otherProps} />
)(
    ({ theme, color }) => ({
        background: color,
        color: theme.palette.getContrastText(color),
    })
);

export default React.memo(CategoryChip);
