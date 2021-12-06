/*
############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################
*/

import './App.css';
import React from 'react';
import TurtlForm from './app/pages/TurtlForm/TurtlForm';

function App() {
  return (
    <div className="App">
        <h1 className="centered">Turtlifier!</h1>
        <TurtlForm />
    </div>
  );
}

export default App;
