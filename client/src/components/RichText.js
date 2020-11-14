import React from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichText.css';

const modules = {
    toolbar: [
        ['clean'],
        [{ 'header': [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }, 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image']
    ]
};
const formats = [
    'background', 'bold', 'color', 'italic', 'link', 'size', 'strike', 'script', 'underline', 'blockquote', 'header', 'list', 'align', 'link', 'image', 'indent'
];



function RichText({ value, onChange, label}) {
    return (
        <div>
            <ReactQuill
                placeholder={label}
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
        </div>
    );
}

export default React.memo(RichText);