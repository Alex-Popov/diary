import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/auth';

function IsAuthenticated(props) {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (isAuthenticated && props.children);
}

export default React.memo(IsAuthenticated);