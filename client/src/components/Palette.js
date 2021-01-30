import React from 'react';
import css from './Palette.module.css';
import * as materialColors from 'material-colors';

export const colors = [
    [materialColors.red['900'], materialColors.red['700'], materialColors.red['500'], materialColors.red['300']],
    [materialColors.pink['900'], materialColors.pink['700'], materialColors.pink['500'], materialColors.pink['300']],
    [materialColors.purple['900'], materialColors.purple['700'], materialColors.purple['500'], materialColors.purple['300']],
    [materialColors.deepPurple['900'], materialColors.deepPurple['700'], materialColors.deepPurple['500'], materialColors.deepPurple['300']],
    [materialColors.indigo['900'], materialColors.indigo['700'], materialColors.indigo['500'], materialColors.indigo['300']],
    [materialColors.blue['900'], materialColors.blue['700'], materialColors.blue['500'], materialColors.blue['300']],
    [materialColors.lightBlue['900'], materialColors.lightBlue['700'], materialColors.lightBlue['500'], materialColors.lightBlue['300']],
    [materialColors.cyan['900'], materialColors.cyan['700'], materialColors.cyan['500'], materialColors.cyan['300']],
    [materialColors.teal['900'], materialColors.teal['700'], materialColors.teal['500'], materialColors.teal['300']],
    ['#194D33', materialColors.green['700'], materialColors.green['500'], materialColors.green['300']],
    [materialColors.lightGreen['900'], materialColors.lightGreen['700'], materialColors.lightGreen['500'], materialColors.lightGreen['300']],
    [materialColors.lime['900'], materialColors.lime['700'], materialColors.lime['500'], materialColors.lime['300']],
    [materialColors.yellow['900'], materialColors.yellow['700'], materialColors.yellow['500'], materialColors.yellow['300']],
    [materialColors.amber['900'], materialColors.amber['700'], materialColors.amber['500'], materialColors.amber['300']],
    [materialColors.orange['900'], materialColors.orange['700'], materialColors.orange['500'], materialColors.orange['300']],
    [materialColors.deepOrange['900'], materialColors.deepOrange['700'], materialColors.deepOrange['500'], materialColors.deepOrange['300']],
    [materialColors.brown['900'], materialColors.brown['700'], materialColors.brown['500'], materialColors.brown['300']],
    [materialColors.blueGrey['900'], materialColors.blueGrey['700'], materialColors.blueGrey['500'], materialColors.blueGrey['300']]
];




function Palette({onSelect}) {
    return <div className="row no-gutters justify-content-between">
        {colors.map(col => (
            <div key={col.join('')} className={css.section}>
                {col.map(c => (
                    <div key={c} className={css.color} style={{backgroundColor:c}} onClick={e => onSelect(c)}></div>
                ))}
            </div>
        ))}
    </div>;
};


export default React.memo(Palette);