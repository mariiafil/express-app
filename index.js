const express = require('express')
const app = express()
const db = require('./db/people')
const list = require('./db/shuffle')
const port = 4000
const cors =require('cors')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: '*'
}));

const makeList = (...args) => {
    let  str = [...args].map(it => it ? it : '').join(', ').replace(/ ,/g, '')
    return str
}

app.get('/people', async (req, res) => {
    const people = await db.getAllPeople()
    res.status(200).json({people})
})

app.post('/person', async (req, res) => {
    const list = req.body.gifts.split(',')
    const hasList = await list.getList()
    if (hasList.length > 0) {
        res.status(400).send('You already shuffled')
    }
    if (!req.body.name.length || !req.body.surname.length) {
        res.status(404).send({error: 'Name and surname are required fields!'})
    } 
    if (list[0].length < 1 || list.length > 10) {
        res.status(404).send({error: 'Your list must have from 1 to 10 items!'})
    } else {
        const listObj = list.reduce((acc, cur, i) => {return ({...acc, [`item_${i + 1}`]: cur.trim() })}, {})
        const resObj = {
            ...req.body,
            ...listObj
        }
        delete resObj.gifts
        const results = await db.createPerson(resObj)
        res.status(200).json({id: results[0].id})
    }
})

app.post('/shuffle', async (req, res) => {
    const people = await db.getAllPeople()
    const hasList = await list.getList()
    if (people.length < 3 || people.length > 500) {
      res.status(400).send('Length of array must 3...500')
    }

    if (hasList.length > 0) {
        res.status(400).send('You already shuffled')
    }

    if (people.length >= 3 && people.length <= 500 && !hasList.length) {
      const randomArr = people
        .map(it => ({...it, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
      const resultArr = []
      
      randomArr.forEach((it, i, arr) => {
        if (i < arr.length - 1) {
          const newObj = {
              person_1: `${it.name} ${it.surname}`,
              list_1: makeList(it.item_1, it.item_2, it.item_3, it.item_4, it.item_5, it.item_6, it.item_7, it.item_8, it.item_9, it.item_10),
              person_2: `${arr[i + 1].name} ${arr[i + 1].surname}`,
              list_2: makeList(arr[i + 1].item_1, arr[i + 1].item_2, arr[i + 1].item_3, arr[i + 1].item_4, arr[i + 1].item_5, arr[i + 1].item_6, arr[i + 1].item_7, arr[i + 1].item_8, arr[i + 1].item_9, arr[i + 1].item_10),
          }
          resultArr.push(newObj)
        } else {
          const newObj = {
              person_1: `${it.name} ${it.surname}`,
              list_1: makeList(it.item_1, it.item_2, it.item_3, it.item_4, it.item_5, it.item_6, it.item_7, it.item_8, it.item_9, it.item_10),
              person_2: `${arr[0].name} ${arr[0].surname}`,
              list_2: makeList(arr[0].item_1, arr[0].item_2, arr[0].item_3, arr[0].item_4, arr[0].item_5, arr[0].item_6, arr[0].item_7, arr[0].item_8, arr[0].item_9, arr[0].item_10),
          }
  
          resultArr.push(newObj)
        }
      })
  
      resultArr.forEach(async it => {
          await list.createList(it)
      })
  
      res.status(200).json(list.getList())
    }
})


app.listen(port, () => {
    console.log('Listening at port: ', port);
})