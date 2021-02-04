import React from 'react';
import Button from '@material-ui/core/Button';

import { styled } from '@material-ui/core/styles';

const CategoryButton = styled(
    ({ color, ...otherProps }) => <Button
        fullWidth
        variant="contained"
        {...otherProps}
    />
)
(
    ({ theme, color }) => ({
        background: `linear-gradient(45deg, ${color} 10%, ${theme.palette.augmentColor({main: color}).light} 90%)`,
        color: theme.palette.getContrastText(color),
        textTransform: 'uppercase'
    })
);

export default React.memo(CategoryButton);
