import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import { observe, ResizeCallback, unobserve } from "./hooks/useResizeObserver/resizeObserverUtil"
import './App.css'

function App() {
  const ref = useRef();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const callback: ResizeCallback = (entry) => {
      console.log(entry);
    }

    observe(ref.current, callback);

    return () => {
      unobserve(ref.current, callback);
    }
  })

  return (
    <div className="App" ref={ref}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
