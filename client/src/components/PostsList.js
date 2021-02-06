import React from 'react';
import { Link } from 'react-router-dom';
import Formatter from '../components/Formatter';
import { DATE_FORMAT } from '../core/formatter';

import Typography from '@material-ui/core/Typography';
import CategoryChipList from '../components/CategoryChipList';
import EmptyData from './EmptyData';
import ButtonBase from '@material-ui/core/ButtonBase';
import css from './PostList.module.css';


function PostsList({ posts }) {
    if (!posts.length)
        return <EmptyData>Ничего не найдено</EmptyData>;

    return posts.map(p => (
        <div key={p.id} className={css.item}>
            <ButtonBase
                component={Link}
                to={`/post/${p.id}`}
                className={css.button}
            >
                <Typography variant="subtitle2" component="div" color="textSecondary" className="text-align_right">
                    <Formatter format={DATE_FORMAT}>{p.date}</Formatter>
                </Typography>
                <Typography variant="h5" component="h2">{p.title}</Typography>
                <CategoryChipList categories={p.categories} />
            </ButtonBase>
        </div>
    ));
}


export default React.memo(PostsList);