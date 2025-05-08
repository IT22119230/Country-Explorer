import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Header from './Components/Header'
import Countries from './Pages/Countries'
import Favourite from './Pages/Favourite'



export default function App() {
  return (
    <BrowserRouter>
   <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/countries" element={<Countries/>}/>
        <Route path="/favourite" element={<Favourite/>}/>
      </Routes>
    </BrowserRouter>
  )
}
