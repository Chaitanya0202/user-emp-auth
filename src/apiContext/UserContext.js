import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [count, setCount] = useState(0);

const  apiurl=`http://localhost:5000/api`


  return (
    <AppContext.Provider value={{  apiurl }}>
      {children}
    </AppContext.Provider>
  );
};

// costom hook
const useGlobelContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider, useGlobelContext };

