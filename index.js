const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('personObject', function getPersonObject (req) {
  return JSON.stringify(req.body)
})
app.use(morgan('tiny', {skip: function (req, res) { return req.method === 'POST' }}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personObject'))

let persons = [
  {
    id: "1",
    name: "Matti Meikäläinen",
    number: "0401234567"
  },
  {
    id: "2",
    name: "Liisa Virtanen",
    number: "0509876543"
  },
  {
    id: "3",
    name: "Pekka Korhonen",
    number: "0451122334"
  },
  {
    id: "4",
    name: "Anna Laine",
    number: "0415566778"
  },
  {
    id: "5",
    name: "Jussi Nieminen",
    number: "0449988776"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date(Date.now()).toString()

  response.send(`
    <div>
      <p>Phonebook has info for ${count} people </p>
      <p>${date} </p>
    </div>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)
  if(person) {
      response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)
  if(person) {
    persons = persons.filter((person) => person.id !== id)
    response.status(200).json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const randomNumber = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
  const id = randomNumber.toString()
  const person = request.body
  
  if(!person.name || !person.number) {
    return response.status(400).json({error: "Missing name or number!"})
  } else {
      const nameExists = persons.some(p =>  p.name === person.name)
    if(!nameExists){
      const personWithId = {id: id, ...person}
      persons.concat(...persons, personWithId)
      response.json(personWithId)
    } else {
      return response.status(400).json({error: "Name already exists!"})
    }
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const personCountandIds = () => {
  let ids = []
  ids = persons.map(person => ids.concat(person.id))
  console.log("persons arr length: " + persons.length + " and id's: " + ids)
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)