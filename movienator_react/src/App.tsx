import React from 'react';
import {RouterProvider} from 'react-router-dom'
import router from "./Router";

/*
Creating the Router Provider from the exportet Route
 */
function App() {
  return (
      <RouterProvider router={router}/>
  )
}

export default App;
