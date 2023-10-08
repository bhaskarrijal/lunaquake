import React, { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import moon0 from '../src/assets/newMap.jpg';
import moon1 from '../src/assets/moon1.jpg';
import backgroundSpace from '../src/assets/spaceNew.jpg';
import finalData from './data/final_data.json'
import quakesData from './data/quakes_data.json'
import missionData from './data/mission_data.json'
import topo from '../src/assets/topo-final.jpg'
import topoIcon from '../src/assets/topo-icon.png'
import lunaIcon from '../src/assets/luna-icon.png'
import elevationMap from '../src/assets/elevation.jpg'
import elevationIcon from '../src/assets/ele-icon.png'
import apollo11Logo from '../src/assets/apollo11.png'
import apollo12Logo from '../src/assets/apollo12.png'
import apollo14Logo from '../src/assets/apollo14.png'
import apollo15Logo from '../src/assets/apollo15.png'
import apollo16Logo from '../src/assets/apollo16.png'
import AppLogo from '../src/assets/moon-logo.png'

function NewMoon() {
    quakesData.forEach((quake) => {
        const { lat, lng, magnitude, date } = quake;
        quake.lat = parseFloat(lat);
        quake.lng = parseFloat(lng);
        quake.magnitude = parseFloat(magnitude);
    })


    const landingSites = missionData.map((mission) => {
        const { lat, lng } = mission;
        return {
            ...mission,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        };
    });

    const globeEl = useRef();

    const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };

    const [selectedQuakeCoordinate, setSelectedQuakeCoordinate] = useState(null);
    const [selectedQuake, setSelectedQuake] = useState(null);
    const [isInDepth, setIsInDepth] = useState(false);
    const [isInDepthQuake, setIsInDepthQuake] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showTopo, setShowTopo] = useState(false);
    const [showElevation, setShowElevation] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(0.5);

    const missionImages = [
        `${apollo11Logo}`,
        `${apollo12Logo}`,
        `${apollo14Logo}`,
        `${apollo15Logo}`,
        `${apollo16Logo}`,
    ];

    // Gen random data
    //   const missionNumber = missionData.length;
    const gData = missionData.map((quakeData, index) => ({
        lat: quakeData.lat + 2,
        lng: quakeData.lng + 2,
        size: 70,
        img: missionImages[index],


    }));

    const handleRotationSpeedChange = (value) => {
        globeEl.current.controls().autoRotateSpeed = value;
        setRotationSpeed(value);
    };

    const onQuakeClick = (quake) => {
        setSelectedMission(null);
        setSelectedQuake(quake);
        setIsInDepthQuake(true);


        // Visualization part
        if (
            selectedQuakeCoordinate &&
            selectedQuakeCoordinate.lat === quake.lat &&
            selectedQuakeCoordinate.lng === quake.lng
        ) {
            setSelectedQuakeCoordinate(null);
        } else {
            setSelectedQuakeCoordinate({
                lat: quake.lat,
                lng: quake.lng,
                radius: 0.2,
                color: 'red',
            });
            zoomIn(quake.lat, quake.lng);
            setSelectedMission(null);
        }
    };

    const zoomIn = (
        lat,
        lng,
    ) => {
        globeEl.current.pointOfView({ lat, lng, altitude: 1.0 }, 3000);
    }

    useEffect(() => {
        globeEl.current.pointOfView(MAP_CENTER, 2000);
    }, []);

    const onInDepthClick = () => {
        setIsInDepth(true);
    }
    const onMissionClick = (mission) => {
        setSelectedQuakeCoordinate(null);
        setSelectedQuake(null);
        const { lat, lng } = mission;
        zoomIn(lat, lng);
        setSelectedMission(mission);
        setIsInDepth(false);
    };

    // importing graphs

    const renderSeismicData = () => {
        if (!selectedMission) {
            return null;
        }

        // Extracting mission data based on selectedMission
        const missionId = selectedMission.mission.replace('Apollo ', 's');
        const missionData = finalData[missionId];

        // Extracting unique years from the mission data
        const uniqueYears = Object.keys(missionData);

        return (
            <div className="seismic-data">
                <div className="selectors">
                    <select
                        onChange={(e) => setSelectedYear(e.target.value)}
                        value={selectedYear}
                        className="px-3 my-3 mr-3 text-white rounded-md bg-white/20"
                    >
                        <option value="" className='text-black'>Select Year</option>
                        {uniqueYears.map((year) => (
                            <option key={year} value={year} className='text-black bg-white/20'>
                                {year}
                            </option>
                        ))}
                    </select>

                    {selectedYear && missionData[selectedYear] && (
                        <>
                            <select
                                onChange={(e) => setSelectedDay(e.target.value)}
                                value={selectedDay}
                                className="px-3 my-2 text-white rounded-md bg-white/20"
                            >
                                <option value="" className='text-black'>Select Day</option>
                                {Object.keys(missionData[selectedYear]).map((day) => (
                                    <option key={day} value={day} className='text-black bg-white/20'>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                {selectedYear && selectedDay && missionData[selectedYear][selectedDay] && (
                    <div className="seismic-activity">
                        <h2 className="font-bold text-sm text-yellow-300 uppercase">
                            Seismic Data from {selectedMission.mission}, Year {selectedYear}, Day {selectedDay}
                        </h2>
                        <ul>
                            {missionData[selectedYear][selectedDay].map((data, index) => {
                                console.log(data)
                                return (
                                    <div key={index} className="flex flex-col text-white">
                                        {/* MH1: {data.mh1}, MH2: {data.mh2}, Mhz: {data.mhz} */}

                                        <table className="my-3 table-auto">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-1 border">MH1</td>
                                                    <td className="px-4 py-1 border">
                                                        {data.mh1 || 'No Data'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-1 border">MH2</td>
                                                    <td className="px-4 py-1 border">
                                                        {data.mh2 || 'No Data'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-1 border">Mhz</td>
                                                    <td className="px-4 py-1 border">
                                                        {data.mhz || 'No Data'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const [autoRotate, setAutoRotate] = useState(false);

    const toggleAutoRotate = (
        status
    ) => {
        globeEl.current.controls().autoRotate = status;
        setAutoRotate(status);
    };

    return (
        <>
            <Globe
                ref={globeEl}
                globeImageUrl={
                    showTopo ? topo : showElevation ? elevationMap : moon0
                }
                bumpImageUrl={moon1}
                showAtmosphere={false}
                backgroundImageUrl={backgroundSpace}
                labelsData={landingSites}
                labelText='mission'
                labelSize={0.8}
                labelDotRadius={0}
                labelColor={() => 'yellow'}
                onLabelClick={(label) => {
                    onMissionClick(label);
                }}
                ringsData={selectedQuakeCoordinate ? [selectedQuakeCoordinate] : []}
                ringColor={() => 'red'}
                ringMaxRadius={2.8}
                htmlElementsData={gData}
                htmlElement={(d) => {
                    const el = document.createElement("div");

                    const img = document.createElement("img");
                    img.src = d.img
                    img.alt = "logo";
                    img.className = "w-8 h-auto";

                    el.appendChild(img);

                    el.style.color = d.color;
                    el.style.width = `${d.size}px`;
                    el.style.pointerEvents = "auto";
                    el.style.cursor = "pointer";

                    return el;
                }}
            />

            <div className="absolute top-0 left-0">
                <div className='px-3 py-1 pb-3 m-5 rounded-md bg-white/10 backdrop-blur-sm back'>
                    <h1 className="text-sm font-medium text-white uppercase">
                        Browse By Missions
                    </h1>
                    <p className="text-xs italic text-white/70">
                        Select a mission to view details
                    </p>
                    <div className="mt-3 text-sm text-white">
                        <ul className="grid grid-cols-5 gap-2">
                            {landingSites.map((site, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="cursor-pointer" onClick={() => {
                                        onMissionClick(site)
                                        showTopo && setShowTopo(false)
                                    }
                                    }>
                                        <img
                                            src={
                                                site.mission === 'Apollo 11' ? apollo11Logo :
                                                    site.mission === 'Apollo 12' ? apollo12Logo :
                                                        site.mission === 'Apollo 14' ? apollo14Logo :
                                                            site.mission === 'Apollo 15' ? apollo15Logo :
                                                                site.mission === 'Apollo 16' ? apollo16Logo : null
                                            }
                                            alt="logo"
                                            className="w-10 h-10"
                                        />
                                        <p className="mt-1 text-xs font-medium text-white">
                                            {site.mission}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="px-3 py-1 pb-3 m-5 rounded-md bg-white/10 backdrop-blur-sm">
                    <h1 className="text-sm font-medium text-white uppercase">
                        Browse By MoonQuakes
                    </h1>
                    <p className="text-xs italic text-white/70">
                        Select a quake to view details and zoom in
                    </p>
                    <div className="custom-scrollbar">
                        <ul className="text-sm text-white">
                            {quakesData.map((quake, index) => (
                                <li key={index} className='mr-2'>
                                    <button className='py-[3px] px-5 mt-1 w-full rounded-md cursor-pointer bg-white/10 hover:bg-white/20 text-xs uppercase'
                                        rel="noreferrer"
                                        onClick={() => {
                                            onQuakeClick(quake)
                                            showTopo && setShowTopo(false)
                                        }}
                                    >
                                        {
                                            quake.date
                                        }
                                    </button>

                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="px-3 py-1 pb-3 m-5 rounded-md bg-white/10 backdrop-blur-sm">
                    <h1 className="text-sm font-medium text-white uppercase">
                        Moon Controls
                    </h1>

                    <div className="flex flex-col justify-between my-2">
                        <p className="mb-2 text-xs italic text-white/70">
                            Select Map Type
                        </p>

                        <div className="flex gap-2">
                            <img src={lunaIcon} alt="moon" className="w-10 h-10 border-2 cursor-pointer"
                                onClick={() => {
                                    setShowTopo(false);
                                    setShowElevation(false);
                                    setSelectedMission(null);
                                    setSelectedQuakeCoordinate(null);
                                    setSelectedQuake(null);
                                }}
                                title='Normal Map'
                            />
                            <img src={topoIcon} alt="moon" className="w-10 h-10 border-2 cursor-pointer"
                                onClick={() => {
                                    setShowTopo(true);
                                    setShowElevation(false);
                                    setSelectedMission(null);
                                    setSelectedQuakeCoordinate(null);
                                    setSelectedQuake(null);
                                }}
                                title='Moon LRO LOLA Color Shaded Relief 388m v4'
                            />
                            <img src={elevationIcon} alt="moon" className="w-10 h-10 border-2 cursor-pointer"
                                onClick={() => {
                                    setShowElevation(true);
                                    setShowTopo(false);
                                    setSelectedMission(null);
                                    setSelectedQuakeCoordinate(null);
                                    setSelectedQuake(null);

                                }}
                                title='Conceptual Elevation Map by GarryKillian'
                            />
                        </div>

                    </div>

                    <div className="flex items-center justify-between gap-1">
                        <p className='text-xs font-medium text-white uppercase'>
                            {autoRotate ? 'Stop Rotation Simulation' : 'Start Rotation Simulation'}
                        </p>
                        <button
                            onClick={() => toggleAutoRotate(!autoRotate)}
                            className="px-2 py-1 mt-1 text-xs font-medium text-white uppercase bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
                        >
                            {
                                autoRotate ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                                </svg>

                            }
                        </button>
                    </div>
                    <p className="text-xs italic text-white/70">Adjust Rotation Speed</p>
                    <Slider
                        value={rotationSpeed}
                        min={1}
                        max={6}
                        onChange={handleRotationSpeedChange}
                    />

                </div>
                <button
                    className="m-5 text-xs uppercase py-[3px] px-5 mt-1 rounded-md cursor-pointer bg-red-500 hover:bg-red-500/80 text-white"
                    rel="noreferrer"
                    onClick={
                        () => {
                            globeEl.current.pointOfView(MAP_CENTER, 2000);
                            setSelectedMission(null);
                            setIsInDepth(false);
                            setSelectedYear(null);
                            setSelectedDay(null);
                            setSelectedQuakeCoordinate(null);
                            setSelectedQuake(null);
                            setAutoRotate(false);
                            toggleAutoRotate(false);
                            setShowTopo(false);
                        }
                    }
                >
                    CLEAR
                </button>
            </div>

            <div className="absolute top-0 right-0 m-5">
                {selectedMission && (
                    <>
                        <div className="px-5 py-2 pb-3 rounded-md w-[400px] bg-white/10 backdrop-blur-sm backdrop-brightness-50">
                            <h4 className="mb-2 text-base font-medium text-white uppercase">
                                {selectedMission.mission}
                            </h4>
                            <p className="mb-2 text-sm italic text-yellow-400">
                                {selectedMission.description}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Launch Date: </span>
                                {selectedMission.date}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Landing Coords: </span>
                                {selectedMission.lat}, {selectedMission.lng}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Program: </span>
                                {selectedMission.program}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Agency: </span>
                                {selectedMission.agency}
                            </p>
                            <h4 className="my-2 text-sm font-medium text-white uppercase">
                                Seismometer Details
                            </h4>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Seismometer Type: </span>
                                {selectedMission.seismometer.type}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Deployment Date: </span>
                                {selectedMission.seismometer.deployment_date}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Location: </span>
                                {selectedMission.seismometer.location} <span className="text-gray-400">({selectedMission.lat}, {selectedMission.lng})</span>
                            </p>

                            <div className='flex justify-between gap-5 mt-2'>
                                <button className="w-full px-5 py-1 mt-1 text-xs font-medium text-white uppercase bg-green-500 rounded-md cursor-pointer hover:bg-green-500/80"
                                    rel="noreferrer"
                                    onClick={() => onInDepthClick()}
                                >
                                    In-Depth Seismic Activities
                                </button>
                                <a className="flex justify-center w-1/3 px-5 py-1 mt-1 text-xs font-medium text-white uppercase bg-blue-600 rounded-md cursor-pointer hover:bg-blue-600/80"
                                    rel="noreferrer"
                                    href={selectedMission.url}
                                    title='Official Mission Details'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                                        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                                    </svg>
                                </a>
                            </div>

                        </div>
                        {
                            isInDepth && (
                                <div className="px-5 py-2 pb-3 mt-3 rounded-md w-[400px] bg-white/10 backdrop-blur-sm backdrop-brightness-50">
                                    <h1 className="text-sm font-medium text-white uppercase">
                                        In-Depth Seismic Activities from {selectedMission.mission}
                                    </h1>

                                    {selectedMission && renderSeismicData()}

                                </div>
                            )
                        }
                    </>
                )}

                {selectedQuake && (
                    <>
                        <div className="px-5 py-2 pb-3 rounded-md w-[400px] bg-white/10 backdrop-blur-sm backdrop-brightness-50">
                            <h3 className="mb-2 text-sm font-medium text-yellow-400 uppercase">
                                MoonQuake Details
                            </h3>
                            <h4 className="mb-2 text-base font-medium text-white uppercase">
                                {selectedQuake.date}
                            </h4>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Latitude: </span>
                                {selectedQuake.lat}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Longitude: </span>
                                {selectedQuake.lng}
                            </p>
                            {/* <p className="text-sm text-white">
                                <span className="text-white/80">Depth: </span>
                                {selectedQuake.depth}
                            </p> */}
                            <p className="text-sm text-white">
                                <span className="text-white/80">Magnitude: </span>
                                {
                                    selectedQuake.magnitude
                                }
                            </p>
                            {/* <p className="text-sm text-white">
                                <span className="text-white/80">Magnitude Type: </span>
                                {selectedQuake.magType}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">NST: </span>
                                {selectedQuake.nst}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Gap: </span>
                                {selectedQuake.gap}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Dmin: </span>
                                {selectedQuake.dmin}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">RMS: </span>
                                {selectedQuake.rms}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Net: </span>
                                {selectedQuake.net}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">ID: </span>
                                {selectedQuake.id}
                            </p>
                            <p className="text-sm text-white">
                                <span className="text-white/80">Updated: </span>
                            </p> */}
                        </div>
                    </>
                )}

                {showTopo && (
                    <>
                        <div className="px-3 py-1 pb-3 rounded-md bg-white/10 backdrop-blur-sm w-[400px]">
                            <h1 className="text-sm font-medium text-white uppercase">
                                Moon LRO LOLA Color Shaded Relief 388m v4
                            </h1>
                            <div className="custom-scrollbar">
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Layer Type: </span>
                                    Shaded Relief
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Source Data: </span>
                                    The layer is derived from the Lunar Orbiter Laser Altimeter (LOLA) data, an instrument on the NASA Lunar Reconnaissance Orbiter (LRO) spacecraft.
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Resolution: </span>
                                    100 meters per pixel (m)
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Data Acquisition Period: </span>
                                    The altimetry data used for generating the DEM was acquired through September 2011 by the LOLA instrument.
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Vertical Precision: </span>
                                    The LOLA instrument collected over 6.5 billion measurements of global surface height with a vertical precision of approximately 10 cm.
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Accuracy: </span>
                                    The accuracy of the surface height measurements is approximately 1 meter.
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Mission and Instrument: </span>
                                    The Lunar Reconnaissance Orbiter (LRO) spacecraft, launched by NASA, carries the LOLA instrument, among others. LOLA has been crucial in collecting high-precision data for creating accurate topographic maps of the Moon's surface.
                                </p>
                                <p className="text-xs text-white">
                                    <span className="text-white/80">Reference Geodetic Framework: </span>
                                    The resulting topographic map from LOLA's data has become a reference geodetic framework for the lunar community, providing highly accurate topographic information and leading to the creation of high-resolution and accurate polar DEMs.
                                </p>
                            </div>
                        </div>
                    </>
                )
                }
            </div>

            {
                !selectedMission && <div className="absolute right-0 flex flex-col items-center justify-center gap-2 bottom-0 m-5">
                    <img src={AppLogo} alt="logo" className="w-auto h-12" />
                    <p className="text-xs text-white">
                        <span className="text-white/80">Made by</span>
                        {' '}
                        <a href="https://www.spaceappschallenge.org/2023/find-a-team/the-catalysts/" className='cursor-pointer hover:underline' target="_blank">
                            team Catalysts
                        </a>
                        {' '}
                        at NASA Space Apps Challenge 2023
                    </p>
                </div>
            }
        </>
    )
}

const Slider = ({ value, min, max, onChange }) => {
    return (
        <input
            type="range"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className='w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20'
        />
    );
};


export default NewMoon