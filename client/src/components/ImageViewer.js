import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import css from './ImageViewer.module.css';
import './ImageGallery.css';
//import useDisableBodyScroll from '../hooks/useDisableBodyScroll';


const renderLeftNav = (onClick, disabled) => (
    <IconButton
        className={css.left}
        disabled={disabled}
        onClick={onClick}
    >
        <ArrowBackIosIcon fontSize="inherit" />
    </IconButton>
);
const renderRightNav = (onClick, disabled) => (
    <IconButton
        className={css.right}
        disabled={disabled}
        onClick={onClick}
    >
        <ArrowForwardIosIcon fontSize="inherit" />
    </IconButton>
);



function ImageViewer({items, index, onClose}) {
//    useDisableBodyScroll(true);
    const isMobile = window.Modernizr.touchevents;

    return (
        <div className={[
            css.fullscreen,
            isMobile ? 'image-gallery_no-thumbnails' : ''
        ].join(' ')}>
            <IconButton
                className={css.close}
                onClick={onClose}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>

            <ImageGallery
                items={items}
                showFullscreenButton={false}
                showPlayButton={false}
                disableKeyDown={true}
                showThumbnails={!isMobile}
                startIndex={index}
                renderLeftNav={renderLeftNav}
                renderRightNav={renderRightNav}
            />
        </div>
    );
}

export default React.memo(ImageViewer);