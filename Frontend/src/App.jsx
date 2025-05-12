import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './Pages/Homepage'
import BookDetail from './Pages/BookDetail'
import AboutUs from './Pages/AboutUs'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Homepage/>
    </>
  )
}

export default App
