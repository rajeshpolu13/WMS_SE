import './App.css';
import Navigationbar from './navbar/Navbar';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux-part/store';
import {useSelector,useDispatch} from 'react-redux';
import { login, logout } from './redux-part/reducers/loginReducer';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
            <Navigationbar />
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
