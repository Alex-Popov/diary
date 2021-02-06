import React from 'react';
import CategoryChip from './CategoryChip';


function CategoryChipList({categories}) {

    return (
        <div className="d-flex flex-wrap py-1">
            {categories.map(c => (
                <CategoryChip key={c.id} label={c.name} color={c.color} className="my-1 mr-1" />
            ))}
        </div>
    );
}

export default React.memo(CategoryChipList);