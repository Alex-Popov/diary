import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../store/auth';

function IsUserRole(props) {
    const isAuthenticated = useSelector(selectIsAuthenticated());
    const userRole = useSelector(selectUserRole);

    return (isAuthenticated && userRole == props.role && props.children);
}

export default React.memo(IsUserRole);