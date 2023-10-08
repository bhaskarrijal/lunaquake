import React, { useState, useEffect } from 'react';
import './App.css';
import NewMoon from './NewMoon';
import SplashScreen from './SplashScreen';
import Logo from './assets/logo.png';
import Cat from './assets/catalysts.png';

function App() {
    const [splash, setSplash] = useState(true);

    return (
        <>
            {
                splash ?
                    <div className='bodyContainer'>
                        <div className="mainContainer">
                            <img src={Cat} className='w-32' />
                            <h1 className='h1Container'>LunaQuake</h1>
                            <p className='text-justify pContainer'>
                                LunaQuake is a web application that allows users to view the moon and study or learn about the moon's seismic history.
                            </p>
                            <span className='rounded-full spanContainer'>NASA Space Apps Challenge 2023</span>
                            <button
                                onClick={() => setSplash(false)}
                                className="aContainer" href="#">
                                Let's Fly To The Moon
                            </button>
                        </div>
                    </div>
                    :
                    <NewMoon />
            }
        </>
    );
}

export default App;
