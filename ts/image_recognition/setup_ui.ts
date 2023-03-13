import { hideElement, showElement } from "../site_state";
import { getElementWithId, getElementsWithClassName } from "../utils/dom_wrangling";
import { handlePostToServer, handleUpload } from './upload_handling';


/*************************** CLOSING AND OPENING THE VIEW */
const openUploadModalBtn = getElementWithId('open-upload-modal-btn', 'BUTTON');
const closeUploadModalBtn = getElementWithId('close-upload-modal-btn', 'BUTTON');

const uploadModal = getElementsWithClassName('upload-sudoku__modal', 'DIV')[0];

function setupUploadModalVisibility() {
  openUploadModalBtn.onclick = function (){
    showElement(uploadModal)
  }

  closeUploadModalBtn.onclick = function (){
    hideElement(uploadModal)
  }
}

/*************************** UPLOADING THE IMAGE */

const photoUploadBtn = getElementWithId('photo-upload-btn', 'BUTTON');
const photoUploadInput = getElementWithId("photo-upload-input", "INPUT");


function setupUploadingFunctionality() {
    photoUploadBtn.onclick = handlePostToServer
    photoUploadInput.onchange = function (e){
        if (
            e.target != null && 
            'files' in e.target
        ) {
            handleUpload(e.target.files as FileList)
        }
        
    }
}


const imagePreview = getElementWithId('preview-img', 'IMG');

export function previewImage(file: File | Blob) {
    if (file.type.match(/^image\// ) == null) throw new Error("The file should be an image")
    const url = URL.createObjectURL(file)
    imagePreview.src = url
}

export function setupImageRecognitionUI() {
  setupUploadModalVisibility()
  setupUploadingFunctionality()
}