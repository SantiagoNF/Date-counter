let events =[] // donde guardar la info de los eventos
let arr = [] //carga la informacion

// referencia de los inputs, boton y container
const eventName = document.querySelector('#eventName')
const eventDate = document.querySelector('#eventDate')
const buttonAdd = document.querySelector('#bAdd')
const eventsContainer = document.querySelector('#eventsContainer')

const json  =   load()

try {
    arr = JSON.parse(json)
} catch (error) {
    arr = []
}

events = arr ? [...arr] : []

renderEvents()

document.querySelector('form').addEventListener('submit', (e) => { // listener del boton submit
    e.preventDefault()
    addEvent()
})

buttonAdd.addEventListener('click', (e) => { 
    e.preventDefault()
    addEvent()
})

function addEvent () {
    if (eventName.value === ' ' ||  eventDate.value === ' ') { // verifica si el espacio de evento y fecha estan vacios, si lo estan no hace nada
        return
    }

    if (dateDiff(eventDate.value) < 0) { // si la fecha introducida es negativa (ya paso) no hace nada
        return
    }

    const newEvent = { // agrega el nuevo evento
        id: (Math.random() * 100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value,
    }

    events.unshift(newEvent)

    save(JSON.stringify(events))

    eventName.value = ' '
    
    renderEvents()
}

function dateDiff (d) { // regresa el numero de dias que falta a la fecha destino
    const date1 = new Date(d)
    const date2 = new Date()
    const difference = date1.getTime() - date2.getTime()
    const days = Math.ceil(difference / (1000 * 3600 * 24))
    return days

}


function renderEvents () {
    const eventsHTML = events.map ( (event) =>{
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number"> ${dateDiff(event.date)} </span>
                    <span class="days-text"> dias </span>
                </div> 
                <div class="event-name"> ${event.name} </div>
                <div class="event-name"> ${event.date} </div>
                <div class="actions"> 
                    <button class="bDelete" data-id="${event.id}"> Eliminar </button>
                </div>
            </div> 
        `
        
    })

    eventsContainer.innerHTML =  eventsHTML.join(' ')

    document.querySelectorAll('.bDelete').forEach( (button) => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id')
            events = events.filter( (event) => event.id !== id)

            save(JSON.stringify(events))

            renderEvents()
        })
        
    })
}

function save(data) {
    localStorage.setItem('items', data)
}
function load() {
    return localStorage.getItem('items')
}