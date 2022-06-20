import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { adminsReducer } from './admins/reducer';
import { projectsReducer } from './projects/reducer';
import { employeesReducer } from './employees/reducer';
import { tasksReducer } from './tasks/reducer';

const rootReducer = combineReducers({
  admins: adminsReducer,
  projects: projectsReducer,
  employees: employeesReducer,
  tasks: tasksReducer
});

const configureStore = () => {
  const enhancer = composeWithDevTools(applyMiddleware(thunk));
  return createStore(rootReducer, enhancer);
};

const store = configureStore();

export default store;
