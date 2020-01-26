import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import reducer from './store/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(reducer);

ReactDOM.render(<Provider store={store}><Routes /></Provider>, document.getElementById('root'));