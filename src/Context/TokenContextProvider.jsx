import { createContext, useState } from 'react'

export const tokenContextObj = createContext();

export default function TokenContextProvider({children}) {

    const [token, setToken] = useState(() => {
        return localStorage.getItem('tkn');
    })

    function modifyToken(value) {
        setToken(value);
    }

    function removeToken() {
        setToken(null);
    }

    return (
        <tokenContextObj.Provider value={{token, modifyToken, removeToken}}>
        {children} 
        </tokenContextObj.Provider>
    )
}
