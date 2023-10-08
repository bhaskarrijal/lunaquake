import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './assets/logo.png';

const SplashScreen = () => {

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-10 text-white bg-black">
            <img src={Logo} alt="Logo" border="0" width="200" height="200" className='animate-rotate prime-logo' />
            <p className="mt-2">
                Developed by The Catalysts for NASA Space App Challenge 2023.
            </p>

            {/* Button to navigate to the MoonComponent */}
            <Link to="/moon">
                <button className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                    Fly to the Moon
                </button>
            </Link>
        </div>
    );
};

export default SplashScreen;
