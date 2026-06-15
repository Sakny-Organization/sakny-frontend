import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { store } from './store';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>);
