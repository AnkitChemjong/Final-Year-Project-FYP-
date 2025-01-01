import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import { Provider } from 'react-redux';
import store from './Store';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <ToastContainer
        position="top-right" 
        autoClose={2000}   
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
  </Provider>
)
