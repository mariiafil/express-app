import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'


const localhost = 'http://localhost:4000'

function App() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [gifts, setGifts] = useState('')
  const [people, setPeople] = useState([])
 
  useEffect(() => {
    axios.get(`${localhost}/people`)
    .then((res) => {
      setPeople(res.data.people)
  })
  }, [])

  const handleShuffle = () => {
    axios.post(`${localhost}/shuffle`)
  }

  const  handleSubmit = async e => {
    e.preventDefault()
      await axios.post(`${localhost}/person`, 
        {
          name,
          surname,
          gifts
        }
      )
      .catch(console.log)
  }

  return (
    <div className="App">
     <form onSubmit={handleSubmit}>
       <label>
         <span>Name:</span> 
         <input
           type='text'
           value={name}
           onChange={(e) => setName(e.target.value)}
        />
       </label>
       <label>
         <span>Surname:</span> 
         <input
           type='text'
           value={surname}
           onChange={(e) => setSurname(e.target.value)}
        />
       </label>
       <label>
         <span>Gifts</span>
         <textarea
         placeholder='Maximum 10 items separated by comma'
           rows={5}
           value={gifts}
           onChange={(e) => setGifts(e.target.value)}
        />
       </label>      

       <button type='submit'>Register</button>

       <button onClick={handleShuffle}>Shuffle</button>
     </form>
     <div>
     </div>
    </div>
  );
}

export default App;
