import { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Loader from '../components/Loader';
import Login from '../components/Login';
import { AuthenticationContext } from '../services/AuthenticationContext';
import AppNavigator from './AppNavigator';

const AccountNavigator = () => {
  
  const {isLoading, user, checkLoggedUser} = useContext(AuthenticationContext);

  useEffect(()=>{
    if(!user){
      checkLoggedUser();
    }
  },[user])
  
  if(isLoading){
    return (<Loader />)
  }

  if(!user){
    return (<Login />)
  }

  return (
    <BrowserRouter>
        <AppNavigator />
    </BrowserRouter>
    );
}

export default AccountNavigator;