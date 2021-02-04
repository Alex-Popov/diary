import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const CategoriesLoadingSkeleton = () => [...Array(5).keys()].map(i => (
    <Skeleton
        key={i}
        variant="text"
        height={50}
    />
));

export default CategoriesLoadingSkeleton;