let timePassed = 0;

let id: number | null = null
let renderFunction: null | ((x: string) => void) = null


function formatTime() {
    const minutes = Math.floor(timePassed / 60)

    const minutesStr = minutes > 9 ? minutes : ` ${minutes}`;
    let seconds = `${timePassed - 60 * minutes}`;
    seconds = seconds.length > 1 ? seconds : `0${seconds}`;
    return `${minutesStr}:${seconds}`

}

function clearTimer(){
    if (id != null) {
        clearInterval(id)
        id = null
    }
}


export function startTimer() {
    console.log(`starting timer... ${timePassed}`)
    clearTimer()
    id = window.setInterval(() => {
        timePassed++
        if (renderFunction != null) {
            renderFunction(formatTime())
        }
    }, 1000)
}

export function pauseTimer() {
    clearTimer()
}


export function renderTime(renderFn: (x: string) => void) {
    console.log(`renreding once... ${timePassed}`)
    renderFn(formatTime())
}

export function setIntervalRenderFunction(renderFn: null | ((x: string) => void)){
    renderFunction = renderFn
}

export function getTimeSpent() {
    return timePassed
}

export function setTimeSpent(time: number) {
    timePassed = time
}