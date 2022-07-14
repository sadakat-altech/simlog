import {AuthenticationContextProvider} from './services/AuthenticationContext';
import './App.css';
import AccountNavigator from './navigators/AccountNavigator';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <AuthenticationContextProvider>
        <AccountNavigator />
      </AuthenticationContextProvider>
    </div>
  );
}

export default App;
