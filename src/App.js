import logo from './logo.svg';
import './App.css';
import PayrollForm from './components/payroll-form/payroll-form';
import Home from './components/home/home';
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/employee-form">
            <PayrollForm />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
