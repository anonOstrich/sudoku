import { ElementsByTagNames, TagName, isElementWithTag } from "./utils/type_checkers";


/**
 * Find references to all the relevant components
 */
const gameMenuBtn = getElementWithId('game-menu-btn', 'BUTTON')
const gameMenuDiv = getElementWithId('game-menu', 'DIV')

const gameMenuHandler = {
    init: () => {
        gameMenuHandler.menuBtn.onclick = gameMenuHandler.toggleVisibility
    },
    menuBtn: gameMenuBtn,
    menu: gameMenuDiv,
    visible: false,
    toggleVisibility: () => {
        console.log("Toggling!")
        if (gameMenuHandler.menu.className.includes('invisible')) {
            gameMenuHandler.menu.className = gameMenuHandler.menu.className.replace('invisible', 'visible')
        } else {
            gameMenuHandler.menu.className = gameMenuHandler.menu.className.replace('visible', 'invisible')
        }
    }
}


function getElementWithId<T extends TagName>(id: string, tagName: T): ElementsByTagNames[T] {
    const el = document.getElementById(id)  
    if (el !== null && isElementWithTag(el, tagName)) {
        return el
    } else {
        console.error(`Element with id ${id} is not of type ${tagName}`)
    }

    console.error(`Was not able to find element with id ${id}. The type checks might be at fault.`)
    throw new Error("Cannot continue without the element.")
}


function attachEventListeners() {
    gameMenuHandler.init()
}

function main() {
    attachEventListeners();
}

main()