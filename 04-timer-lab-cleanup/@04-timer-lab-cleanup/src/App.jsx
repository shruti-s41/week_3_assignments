import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Stopwatch from './Stopwatch.jsx'
import Timer from './Timer.jsx'
import Pomodoro from './Pomodoro.jsx'


function App() {
  const [tab, setTab] = useState("stopwatch")


  return <div id="main">
    <button onClick={() => setTab("stopwatch")}>Stopwatch</button>
    <button onClick={() => setTab("timer")}>Countdown Timer</button>
    <button onClick={() => setTab("pomodoro")}>Pomodoro</button>
    <section id="timer">
      {tab === "stopwatch" && <Stopwatch />}
      {tab === "timer" && <Timer />}
      {tab === "pomodoro" && <Pomodoro />}
    </section>
  </div>
  
}

export default App
