
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

function test(state = { b: true }, action) {
    return state;
}

const rootReducer = combineReducers({ test });
export default createStore(rootReducer);
