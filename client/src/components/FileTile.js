import React from 'react';
import {
    URL_ATTACHMENT_FILE,

    FILE_TYPE_IMAGES,
    FILE_TYPE_DOCUMENT,
    FILE_TYPE_SPREADSHEET,
    FILE_TYPE_PRESENTATION,
    FILE_TYPE_VIDEO,
    FILE_TYPE_AUDIO,
    FILE_TYPE_ACROBAT,
    FILE_TYPE_TEXT,
    FILE_TYPE_DATA,
    FILE_TYPE_COMPRESSED
} from '../const';

import FileTypeDocument from '../icons/FileTypeDocument';
import FileTypeSpreadsheet from '../icons/FileTypeSpreadsheet';
import FileTypePresentation from '../icons/FileTypePresentation';
import FileTypeVideo from '../icons/FileTypeVideo';
import FileTypeAudio from '../icons/FileTypeAudio';
import FileTypeAcrobat from '../icons/FileTypeAcrobat';
import FileTypeText from '../icons/FileTypeText';
import FileTypeData from '../icons/FileTypeData';
import FileTypeCompressed from '../icons/FileTypeCompressed';
import FileTypeDefault from '../icons/FileTypeDefault';

import css from './FileTile.module.css';


const mapIconByType = [
    {
        type: FILE_TYPE_DOCUMENT,
        icon: FileTypeDocument
    },
    {
        type: FILE_TYPE_SPREADSHEET,
        icon: FileTypeSpreadsheet
    },
    {
        type: FILE_TYPE_PRESENTATION,
        icon: FileTypePresentation
    },
    {
        type: FILE_TYPE_VIDEO,
        icon: FileTypeVideo
    },
    {
        type: FILE_TYPE_AUDIO,
        icon: FileTypeAudio
    },
    {
        type: FILE_TYPE_ACROBAT,
        icon: FileTypeAcrobat
    },
    {
        type: FILE_TYPE_TEXT,
        icon: FileTypeText
    },
    {
        type: FILE_TYPE_DATA,
        icon: FileTypeData
    },
    {
        type: FILE_TYPE_COMPRESSED,
        icon: FileTypeCompressed
    }
];


/*
fileName: "536.jpg"
id: 1
mimeType: "image/jpeg"
ownerId: 2
postId: 6
relativeFilePath: "1606328484961_BMqvPIHOJeyrIlr3O9ew4"
size: 536495
*/

function FileTile({ id, fileName, mimeType, onClick }) {
    const isImage = FILE_TYPE_IMAGES.includes(mimeType);
    let FileTypeIcon = FileTypeDefault;

    if (!isImage) {
        const mapper = mapIconByType.find(m => m.type.includes(mimeType));
        if (mapper) FileTypeIcon = mapper.icon;
    }


    return (
        <a
            onClick={onClick ? () => onClick(id) : undefined}
            className={css.link}
            href={URL_ATTACHMENT_FILE+id}
            target="_blank"
            rel="noopener noreferrer"
        >
            {isImage
                ? (
                    <div>
                        <img
                            alt=""
                            src={URL_ATTACHMENT_FILE+id}
                            className={css.image}
                        />
                    </div>
                )
                : (
                    <div className={css.container}>
                        <FileTypeIcon className={css.typeIcon} />
                    </div>
                )
            }
            <div className={`mt-2 text-align_center text-truncate ${css.name}`} title={fileName}>{fileName}</div>
        </a>
    );

}
export default React.memo(FileTile);