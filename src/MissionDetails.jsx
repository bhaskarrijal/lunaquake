import React from 'react';

const MissionDetails = ({ mission }) => {
    const { mission: missionName, seismometer } = mission;
    const {
        type,
        deployment_date: deploymentDate,
        location,
    } = seismometer;

    return (
        <div className="absolute top-0 right-0 px-5 py-2 pb-3 m-5 rounded-md bg-white/10 backdrop-blur-sm">
            <p className="text-sm text-white uppercase">
                Mission: {missionName}
            </p>
            <p className="text-sm text-white">
                Seismometer Type: {type}
            </p>
            <p className="text-sm text-white">
                Deployment Date: {deploymentDate}
            </p>
            <p className="text-sm text-white">
                Location: {location}
            </p>
        </div>
    );
};

export default MissionDetails;
