import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../interceptor/axiosInstance';

const AppContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [ alert, setAlert] = useState('');
  const [ userId, setUserId ] = useState(localStorage.getItem("userId"))
  // const [ plantList, setPlantList ] = useState([])
  const [ rightsList, setRightsList ] = useState([])
  const [ searchInput, setSearchInput ] = useState()
  const [ courseSearch, setCourseSearch ] = useState()
  const [ userSearch, setUserSearch ] = useState()
  const [ workerSearch, setWorkerSearch ] = useState()
  // const [ userData, setUserData ] = useState(JSON.parse(sessionStorage.getItem("userData")))

  // useEffect(() => {
  //   if (userData) {
  //     sessionStorage.setItem("userData", JSON.stringify(userData))
  //     console.log(userData)
  //   }
  // }, [userData])

  useEffect(() => {
    // axiosInstance
    //   .get("accounts/api/plant/")
    //   .then(res => {
    //     setPlantList(res.data.data)
    //   })
    //   .catch(error => {
    //     setPlantList(null)
    //     console.log(error)
    //   })

    axiosInstance
      .get(`individual_analytics/users/${userId}/`)
      .then(res => {
        setRightsList(res.data.data.access)
      })
      .catch(error => {
        setRightsList(null)
        console.log(error)
      })
  }, [userId])

  useEffect(() => {
    if (searchInput) {

      axiosInstance
        .get(`courses/course/?search=${searchInput}`)
        .then(res => {
          setCourseSearch(res.data.data)
        })
        .catch(error => {
          console.error(error)
        })
      
      axiosInstance
        .get(`accounts/api/users/?search=${searchInput}`)
        .then(res => {
          setUserSearch(res.data.data)
        })
        .catch(error => {
          console.error(error)
        })
      
      axiosInstance
        .get(`accounts/api/worker/?search=${searchInput}`)
        .then(res => {
          setWorkerSearch(res.data.data)
        })
        .catch(error => {
          console.error(error)
        })

    }
  }, [searchInput])

  return (
    <AppContext.Provider
      value={{
        alert,
        setAlert,
        userId,
        setUserId,
        // plantList,
        rightsList,
        setSearchInput,
        courseSearch,
        userSearch,
        workerSearch,
        // userData,
        // setUserData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(AppContext);
