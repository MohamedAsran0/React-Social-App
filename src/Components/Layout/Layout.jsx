import React from 'react'
import Navbar from './../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './../Footer/Footer';

export default function Layout() {
  return (
    <>
      <div className='min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-500 to-gray-200'>
        <Navbar />
        
        <Outlet />
        
        <Footer />
      </div>
    </>
  )
}
