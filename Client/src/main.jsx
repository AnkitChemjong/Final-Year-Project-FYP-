import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import axios from 'axios';

//setting it true to work with the sessions and cookies
axios.defaults.withCredentials=true;

createRoot(document.getElementById('root')).render(
  <>
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
  </>
)
