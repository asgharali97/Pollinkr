import React from 'react'
import { Outlet } from 'react-router-dom'
const App = () => {
  return (
    <div className='w-full'>
      <Outlet />
    </div>
  )
}

export default App
