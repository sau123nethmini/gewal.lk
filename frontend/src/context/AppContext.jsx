import { createContext } from "react";
import { properties } from '../assets/assets';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const value = {
        properties
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;
