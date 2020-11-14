import React from 'react';
import CategoryChip from './CategoryChip';


function CategoryChipList({categories}) {

    return (
        <div className="d-flex flex-wrap mx-n1">
            {categories.map(c => (
                <CategoryChip key={c.id} label={c.name} color={c.color} className="m-1" />
            ))}
        </div>
    );
}

export default React.memo(CategoryChipList);