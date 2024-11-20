
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import cartReducer from '../reducers/cartReducer';
import productReducer from '../reducers/productReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productReducer,
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
