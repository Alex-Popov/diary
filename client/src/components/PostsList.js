import React from 'react';
import { Link } from 'react-router-dom';
import Formatter from '../components/Formatter';
import { DATE_FORMAT } from '../core/formatter';

import Typography from '@material-ui/core/Typography';
import CategoryChipList from '../components/CategoryChipList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import EmptyData from './EmptyData';


function PostsList({ posts }) {
    if (!posts.length)
        return <EmptyData>Ничего не найдено</EmptyData>;

    return posts.map(p => (
        <Card key={p.id} className="mb-3">
            <CardActionArea disableRipple component={Link} to={`/post/${p.id}`}>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Formatter format={DATE_FORMAT}>{p.date}</Formatter>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">{p.title}</Typography>
                    <CategoryChipList categories={p.categories} />
                </CardContent>
            </CardActionArea>
        </Card>
    ));
}


export default React.memo(PostsList);