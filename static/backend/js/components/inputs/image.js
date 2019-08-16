import React from 'react';
import { Button } from '../button';
import { useDropzone } from 'react-dropzone';

function Dropzone(props) {
    //* Taken from https://react-dropzone.js.org
    const {acceptedFiles, rejectedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png, image/jpg',
        multiple: false,
        noDrag: false,
        onDrop: acceptedFiles => {
            props.handleFileChange(acceptedFiles);
        }
    });
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} id={"file-" + props.contentId} />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <p>Drag and drop files here</p><br />
            <p>or</p><br />
            <Button>Select</Button>
        </div>
  );
}

export class Image extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this)

        this.state = {
            image: undefined,
        }
    }
    handleFileChange(file) {
        var reader = new FileReader();

        reader.addEventListener("load", (event) => {
            // $("#image-" + this.props.contentId).attr("src", event.target.result);
            // $("#image-" + this.props.contentId).css('display', 'block');
        }, false)

        reader.readAsDataURL(new Blob(file));
        this.setState({
            imageEdited: true,
            tempFile: file,
        });
    }
    render() {
        return (
            <>
                <label htmlFor={"file-" + this.props.contentId}>{this.props.label}</label>
                <Dropzone handleFileChange={this.handleFileChange} />
            </>
        )
    }
}
