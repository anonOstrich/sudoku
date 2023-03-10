import { getElementWithId } from './utils/dom_wrangling';
import { image as testImage } from './test_image_data';


const API_URL = 'http://localhost:3000/hello';

const testButton = getElementWithId('backend-test-btn', 'BUTTON')

const headers = {

}

async function buttonHandler() {

    const dataToSend = {
        "name": "sudoku.jpg",
        "imageBase64": testImage
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(dataToSend)
        });
        const data = await response.json();
        console.log(`Response from the backend: ${JSON.stringify(data, null, 2)}`)
    }
    catch (error) {
        console.log(`Error from requesting backend: ${error}`)
    }
}

export function testBackend(){
    testButton.onclick = buttonHandler
}

