import React, { useState } from 'react'

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">ShopEasy</h1>
        <p className="text-gray-600 mb-4">App is working!</p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
        >
          Count: {count}
        </button>
      </div>
    </div>
  )
}

export default App
