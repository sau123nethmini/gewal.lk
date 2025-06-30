import { createContext } from "react";
import { properties } from '../assets/assets';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = 'LKR'

    const value = {
        properties,
        currencySymbol
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;
