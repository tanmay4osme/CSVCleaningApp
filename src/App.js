import React from 'react';
import Login from '../src/components/Login';
import CSVUpload from '../src/components/CSVUpload';
import Dashboard from '../src/components/Dashboard';

const App = () => {
  return (
    <div>
      <h1>CSV Data Cleaning Application</h1>
      <Login />
      <CSVUpload />
      <Dashboard />
    </div>
  );
};

export default App;
