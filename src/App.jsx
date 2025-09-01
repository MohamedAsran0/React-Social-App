
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import NotFound from './Components/NotFound/NotFound';
import TokenContextProvider from './Context/TokenContextProvider';
import ProtectedRouteLoggedOut from './Context/ProtectedRouteLoggedOut';
import ProtectedRouteLoggedIn from './Context/ProtectedRouteLoggedIn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRouteLoggedIn> <Login /> </ProtectedRouteLoggedIn> },
      { path: 'login', element: <ProtectedRouteLoggedIn> <Login /> </ProtectedRouteLoggedIn> },
      { path: 'register', element: <ProtectedRouteLoggedIn> <Register /> </ProtectedRouteLoggedIn> },
      { path: 'home', element: <ProtectedRouteLoggedOut> <Home /> </ProtectedRouteLoggedOut> },
      { path: 'profile', element: <ProtectedRouteLoggedOut> <Profile /> </ProtectedRouteLoggedOut> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <TokenContextProvider>

        <QueryClientProvider client={queryClient} >

          <RouterProvider router={router} />

        </QueryClientProvider>

      </TokenContextProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  )
}

export default App
