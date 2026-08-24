import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Post from './Post.jsx'


function App() {
  const [load, setLoad] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")
  const [data, setData] = useState([])
  const url = "https://jsonplaceholder.typicode.com/posts"

  const fetchData = () => {
    setLoad(true)
    fetch(url)
    .then(response => {
      if(!response.ok){
        setError(true)
        throw new Error(response.status)
      }
      return response.json()
    })
    .then(data => {
      setData(data)
      setLoad(false)
    })
    .catch(err => {
      setLoad(false)
      setError(true)
      console.error(err)
    })
    
  }
  const filteredPosts = data.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    )
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div id= "body">
      <h1>Posts</h1>
      <input placeholder = "Search for a post" onChange={(event)=> {
        setSearch(event.target.value)
      }}></input>
      {error && <h1>Something went wrong</h1>}
      {load && <h1>Loading...</h1>}
        <div id="grid">{
          filteredPosts.map((post)=>{
            return <Post title = {post.title} body = {post.body} />
          })
        }</div>
    </div>
  )
}

export default App
