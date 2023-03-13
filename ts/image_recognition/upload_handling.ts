import { getElementWithId } from "../utils/dom_wrangling"
import { previewImage } from "./setup_ui"


// Not sending stupidly large photos
// But: allow cropping or send large enough photos that there is resolution
// for accurate cell classification!
const MAX_WIDTH = 400
const MAX_HEIGHT =  400

let rawFile: File | null = null


async function convertToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = function () {
            resolve(fileReader.result as string)
        }
        fileReader.onerror = function (error) {
            reject(error)
        }
        fileReader.readAsDataURL(file)
    })
}


const imagePreview = getElementWithId('preview-img', 'IMG');


export function handleUpload(files: FileList) {
    console.log(`Handling.... length: ${files.length}`)
    const file = files[0]
    console.log(`File: ${file.type}`)
    rawFile = file
    previewImage(file)
}


// This uses the image element on the page, not the raw file
async function resizeImage(): Promise<Blob> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const originalWidth = imagePreview.width
    const originalHeight = imagePreview.height

    console.log(`width: ${originalWidth}, height: ${originalHeight}`)

    canvas.width = 200;
    canvas.height = 200;

    ctx?.drawImage(imagePreview, 0, 0, canvas.width, canvas.height)
    // const dataURL = canvas.toDataURL()
    

    return new Promise((resolve, reject) => {
        canvas.toBlob((data) => {
            canvas.remove()
            if (data === null) {reject(new Error("No data"))}
             else {
                resolve(data)
            }   
        }, rawFile?.type ?? "image/png")  
    })
}

export async function handlePostToServer() {
    if (rawFile === null) throw new Error("No file to upload")
    if (rawFile.type === "image/png") {
        rawFile
    }
    console.log("About to resize!")
    const resizedImage = await resizeImage()
    console.log("Resized!")
    previewImage(resizedImage)
    // imagePreview.src = resizedImageDataURL
    
    const encoded = await convertToBase64(resizedImage)
    console.log(encoded)
}