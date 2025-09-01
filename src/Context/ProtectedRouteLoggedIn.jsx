import { Navigate } from 'react-router-dom'




export default function ProtectedRouteLoggedIn({ children }) {


    if (localStorage.getItem('tkn') != null) {
        return <Navigate to= '/home' />
    }


    return (
        <>
            {children}
        </>
    )
}
