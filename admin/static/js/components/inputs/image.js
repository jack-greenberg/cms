import React from 'react';
import { Button } from '../button';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';

//* Taken from https://react-dropzone.js.org
const dropzoneRef = React.createRef();
const openDialog = () => {
    if (dropzoneRef.current) {
        dropzoneRef.current.open()
    }
};
export class Image extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this)
        this.changeImage = this.changeImage.bind(this)

        this.dropzoneRef = React.createRef();

        this.state = {
            tempImage: undefined,
        }
    }
    handleFileChange(file) {
        console.log(file);
        var reader = new FileReader();

        reader.addEventListener("load", (event) => {
            document.getElementById('image-' + this.props.id).src = event.target.result
            document.getElementById('image-' + this.props.id).style.display = 'block'
            document.getElementById('input-' + this.props.id).parentElement.style.display = 'none'
        }, false)

        reader.readAsDataURL(new Blob(file));
        this.setState({
            tempImage: file,
        });
    }
    changeImage() {
        console.log(dropzoneRef, dropzoneRef.current)
        if (dropzoneRef.current) {
            dropzoneRef.current.open()
        }        
    }
    render() {
        return (
            <>
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <img src="" alt="Image preview" style={{display: "none", width: "100%"}} id={"image-" + this.props.id} className="mb-2" />
                {this.state.tempImage
                    ? (
                        <div className="flex  flex-justifyBetween  flex-alignCenter  mb-2">
                            <button className="link  blue  dim  f-1" onClick={openDialog}>Change image</button>
                            <button className="link  red  dim  f-1">Remove image</button>
                        </div>
                    )
                    : null
                }
                <Dropzone ref={dropzoneRef} accept={'image/jpeg, image/png, image/jpg'} onDrop={file => this.handleFileChange(file)}>
                    {({getRootProps, getInputProps, acceptedFiles}) => {
                        return (
                            <div {...getRootProps({className: 'Dropzone  p-1  center'})}>
                                <input {...getInputProps()} id={"input-" + this.props.id} />
                                <p className="f-1">Drag and drop files here</p><br />
                                <p className="f-1" style={{color: '#999'}}>or</p><br />
                                <button className="Button  Button--blue  dim  f-1">Select</button>
                            </div>
                        );
                    }}
                </Dropzone>
            </>
        )
    }
}
