import React from 'react';
import { ROLE_ADMIN } from '../const';
import IsUserRole from './IsUserRole';


function IsAdmin(props) {
    return <IsUserRole {...props} role={ROLE_ADMIN} />;
}

export default React.memo(IsAdmin);