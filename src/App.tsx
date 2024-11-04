import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <html lang="en">
      <head>
        <title>CSS Website Layout</title>
      </head>
      <body>

        

        <div className="row">
          <div className="column control">
            <div className="row">
              <div className="column parbox">
                <div className='parameter'>
                  <label htmlFor="parIn">Step Size </label>
                  <input className='parIn' type='text'></input>
                  <label htmlFor="parIn"> °</label>
                </div>
                <div className='parameter'>
                  <label htmlFor="parIn">Power Min </label>
                  <input className='parIn' type='text'></input>
                  <label htmlFor="parIn"> V</label>
                </div>
              </div>
              <div className="column parbox">
              <div className='parameter'>
                <label htmlFor="parIn">Cycles </label>
                <input className='parIn' type='text'></input>
                <label htmlFor="parIn"> °</label>
              </div>
              <div className='parameter'>
                <label htmlFor="parIn">Power Max </label>
                <input className='parIn' type='text'></input>
                <label htmlFor="parIn"> V</label>
              </div>
              </div>
            </div>
          </div>
  
          <div className="column view">
            <h2>Main Content</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet pretium urna. Vivamus venenatis velit nec neque ultricies, eget elementum magna tristique. Quisque vehicula, risus eget aliquam placerat, purus leo tincidunt eros, eget luctus quam orci in velit. Praesent scelerisque tortor sed accumsan convallis.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet pretium urna. Vivamus venenatis velit nec neque ultricies, eget elementum magna tristique. Quisque vehicula, risus eget aliquam placerat, purus leo tincidunt eros, eget luctus quam orci in velit. Praesent scelerisque tortor sed accumsan convallis.</p>
          </div>
        </div>
      </body>
    </html>
      
    

  );
}

export default App;
