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
            <div className="row test">
              <div className="column parbox">
                <div className='parameter'>
                  <label className='parText parIn'>Step Size </label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>∠</label>
                </div>
                <div className='parameter'>
                  <label className='parText parIn'>Power Min </label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>V</label>
                </div>
              </div>
              <div className="column parbox">
                <div className='parameter right'>
                  <label className='parText parIn'>Cycles </label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>°</label>
                </div>
                <div className='parameter right'>
                  <label className='parText parIn'>Power Max </label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>V</label>
                </div>
              </div>
            </div>
            <div className='instructionset'>
              <div className='instruction'>
                  <label> Rotation 1</label>
                  <label className='parText parIn'>∠</label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>T</label>
                  <input className='parIn' type='text'></input>
              </div>
              <div className='instruction'>
                  <label> Rotation 2</label>
                  <label className='parText parIn'>∠</label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>T</label>
                  <input className='parIn' type='text'></input>
              </div>
              <div className='instruction'>
                  <label> Rotation 3</label>
                  <label className='parText parIn'>∠</label>
                  <input className='parIn' type='text'></input>
                  <label className='parText parIn'>T</label>
                  <input className='parIn' type='text'></input>
              </div>
            </div>
            <div className="toolbar">
              <button type = "button" id = "run tbbutton">RUN</button>
              <button type = "button" id = "import tbbutton">I</button>
              <button type = "button" id = "save tbbutton">S</button>
              <button type = "button" id = "loop tbbutton">L</button>
              <button type = "button" id = "add tbbutton">+</button>
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
