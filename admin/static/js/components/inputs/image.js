import React from 'react';
import { Button } from '../button';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';

export class Image extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this)
        this.changeImage = this.changeImage.bind(this)
        this.removeImage = this.removeImage.bind(this)

        this.dropzoneRef = React.createRef();

        this.state = {
            tempImage: undefined,
        }
    }
    componentDidMount() {
        if (this.props.src) {
            // document.getElementById('image-' + this.props.id).style.display = 'block'
            // document.getElementById('image-' + this.props.id).src = this.props.src
            document.getElementById('input-' + this.props.id).parentElement.style.display = 'none'
        }
    }
    handleFileChange(file) {
        var reader = new FileReader();

        reader.addEventListener("load", (event) => {
            document.getElementById('image-' + this.props.id).src = event.target.result
            document.getElementById('image-' + this.props.id).style.display = 'block'
            document.getElementById('dropzone-' + this.props.id).style.display = 'none'
        }, false)

        reader.readAsDataURL(new Blob(file));
        this.setState({
            tempImage: file,
        });
    }
    changeImage() {
        if (this.dropzoneRef.current) {
            this.dropzoneRef.current.open()
        }        
    }
    removeImage() {
        document.getElementById('image-' + this.props.id).src = null
        document.getElementById('image-' + this.props.id).style.display = 'none'
        document.getElementById('dropzone-' + this.props.id).style.display = 'block'
        this.setState({
            tempFile: undefined,
        })
    }
    render() {
        return (
            <div className="ImageInput__wrapper  my-2">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <img src={this.props.src} alt={this.props.caption ? this.props.caption : "Image preview"} style={{display: this.props.src ? "block" : "none", width: "100%"}} id={"image-" + this.props.id} className="mb-2" />
                {this.state.tempImage || this.props.src
                    ? (
                        <div className="flex  flex-justifyEnd  flex-alignCenter  mb-2">
                            <button className="link  blue  dim  f-1" onClick={this.changeImage}>Change image</button>
                            {/* <button className="link  red  dim  f-1" onClick={this.removeImage}>Remove image</button> */}
                        </div>
                    )
                    : null
                }
                <Dropzone ref={this.dropzoneRef} accept={'image/jpeg, image/png, image/jpg'} onDrop={file => this.handleFileChange(file)}>
                    {({getRootProps, getInputProps, acceptedFiles}) => {
                        //* Taken from https://react-dropzone.js.org
                        return (
                            <div {...getRootProps({className: 'Dropzone  p-1  center'})} id={'dropzone-' + this.props.id}>
                                <input {...getInputProps()} id={"input-" + this.props.id} />
                                <p className="f-1">Drag and drop files here</p><br />
                                <p className="f-1" style={{color: '#999'}}>or</p><br />
                                <button className="Button  Button--blue  dim  f-1">Select</button>
                            </div>
                        );
                    }}
                </Dropzone>
            </div>
        )
    }
}
