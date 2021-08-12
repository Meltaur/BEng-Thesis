import React, { Suspense } from 'react'
import Login from './components/Login'
import Header from './components/Header'
import Footer1 from './components/Footer1'
import './i18n'

function App() {

  return (
      <div id="container">
        <Suspense fallback={null}>
          <Header />
          <Login />
          <Footer1 />
        </Suspense>
      </div>
  );
}

export default App;
