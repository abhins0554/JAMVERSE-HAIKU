// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);







/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './source2/index';
import { name as appName } from './app.json';

import { Platform } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'; // Use the standard import
import thunk from 'redux-thunk';
import Reducer from './source2/Redux/index';

function middleware() {
    return compose(applyMiddleware(thunk));
}

const store = createStore(Reducer, middleware());

const RNRedux = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(Platform.OS === 'ios' ? 'JamAPP' : 'jamverse', () => RNRedux);
