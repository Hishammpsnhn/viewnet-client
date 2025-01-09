import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-blue-500 text-white text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Hello, Tailwind CSS!</h1>
      <p className="mt-4">Vite + TypeScript + Tailwind is ready!</p>
    </div>
  )
}

export default App
