import './App.css';
import Navigationbar from './navbar/Navbar';
import {HashRouter,BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux-part/store';
function App() {
  return (
    <div className="App">
      
      <Provider store={store}>
      <HashRouter>
     
            <Navigationbar />
   
      </HashRouter>
      </Provider>
     
    </div>
  );
}

export default App;
