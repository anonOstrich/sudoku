import { getElementWithId } from "../utils/dom_wrangling"
import { postSudokuImage } from "./api"
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

function calculateScalingRatio(width: number, height: number): number {
    if (width <= MAX_WIDTH && height <= MAX_HEIGHT) return 1.0
    const widthRatio = width / MAX_WIDTH
    const heightRatio = height / MAX_HEIGHT

    if (widthRatio > heightRatio) {
        return 1 /  widthRatio
    } else {
        return 1 /  heightRatio
    }
}


// This uses the image element on the page, not the raw file
async function resizeImage(): Promise<Blob> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // TODO´: The img element already resizes, which is NOT desirable!
    // Find a way to preserve the original until this point.
    const originalWidth = imagePreview.width
    const originalHeight = imagePreview.height

    console.log(`width: ${originalWidth}, height: ${originalHeight}`)

    const scalingRatio = calculateScalingRatio(originalWidth, originalHeight)
    canvas.width = scalingRatio * originalWidth;
    canvas.height = scalingRatio * originalHeight;

    console.log(`scaled width: ${canvas.width}, scaled height: ${canvas.height}}`)

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

async function resizePhoto(){
    if (rawFile === null) throw new Error("No file to resize")
    
    console.log("About to resize!")
    return  await resizeImage()
}

export async function handlePhotoResize(){
    
    const resizedImage = await resizePhoto()
    previewImage(resizedImage)
}

export async function handlePostToServer() {
    const resizedImage = await resizePhoto()    
    const encoded = await convertToBase64(resizedImage)

    console.log("About to send!")
    const received = await postSudokuImage(encoded)
    console.log(received)
}