import { useState } from 'react';

import './App.css';
import { LandingPage , Header} from './handler/index.js';
function App() {
  return (
    <>
    <Header></Header>
      <LandingPage></LandingPage>
    </>
  );
}

export default App;
