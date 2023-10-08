import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import moon0 from '../src/assets/map2.jpg';
import moon1 from '../src/assets/moon1.jpg';
import bg from '../src/assets/black.jpeg';

const MoonComponent = () => {
    const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0, z: 0 });
    useEffect(() => {
        // const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
        // const displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";
        // const worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg";
        const textureURL = moon0;
        const displacementURL = moon1;
        const worldURL = bg;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('moon-container').appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(2, 60, 60);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(textureURL);
        const displacementMap = textureLoader.load(displacementURL);
        const worldTexture = textureLoader.load(worldURL);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            displacementMap: displacementMap,
            displacementScale: 0.06,
            bumpMap: displacementMap,
            bumpScale: 0.04,
            reflectivity: 0,
            shininess: 0,
        });

        const moon = new THREE.Mesh(geometry, material);

        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(-100, 10, 50);
        light.intensity = 0;  // Adjust the intensity to make the moon brighter
        scene.add(light);

        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 2);  // Use the same color for both to make it fully bright
        hemiLight.position.set(0, 0, 0);
        scene.add(hemiLight);


        const worldGeometry = new THREE.SphereGeometry(1000, 60, 60);
        const worldMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: worldTexture,
            side: THREE.BackSide
        });
        const world = new THREE.Mesh(worldGeometry, worldMaterial);
        scene.add(world);

        scene.add(moon);
        camera.position.z = 5;

        moon.rotation.x = 3.1415 * 0.02;
        moon.rotation.y = 3.1415 * 1.54;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;

        const animate = () => {
            requestAnimationFrame(animate);
            // moon.rotation.y += 0.002;
            // moon.rotation.x += 0.0001;
            // world.rotation.y += 0.0001;
            // world.rotation.x += 0.0005;

            // Update the position of the plotted marker based on the moon's rotation
            if (marker) {
                var { x, y, z } = marker.position;
                var newPosition = rotatePoint({ x, y, z }, { x: 0, y: 0, z: 0 }, 0.002);
                marker.position.set(newPosition.x, newPosition.y, newPosition.z);
            }

            if (markerPosition) {
                var { x, y, z } = rotatePoint(markerPosition, { x: 0, y: 0, z: 0 }, 0.002);
                marker.position.set(x, y, z);
            }

            renderer.render(scene, camera);
        };

        const rotatePoint = (point, center, angle) => {
            var { x, y } = point;
            var s = Math.sin(angle);
            var c = Math.cos(angle);

            // Translate point back to origin
            x -= center.x;
            y -= center.y;

            // Rotate point
            var xNew = x * c - y * s;
            var yNew = x * s + y * c;

            // Translate point back
            return {
                x: xNew + center.x,
                y: yNew + center.y,
                z: point.z  // Assuming z coordinate doesn't change
            };
        };


        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const plotCoordinates = (scene, radius, latitude, longitude) => {
            // Convert latitude and longitude to radians
            const phi = (latitude - 90) * (Math.PI / 180);
            const theta = (longitude + 180) * (Math.PI / 180);

            // Convert spherical coordinates to Cartesian coordinates
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);

            const markerGeometry = new THREE.SphereGeometry(0.05);  // Adjust the size as needed
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });  // Red color for the marker
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);

            // Position the marker on the surface of the moon
            marker.position.set(x, y, z);

            // Add the marker to the scene
            scene.add(marker);

            return marker;
        };

        window.addEventListener('resize', onResize, false);

        // MARK START
        const radius = 2;  // Assuming the moon radius is 2 for this example
        const marker = plotCoordinates(scene, radius, 45, 45);
        scene.add(marker)

        setMarkerPosition({ x: marker.position.x, y: marker.position.y, z: marker.position.z });
        // MARK END

        animate();

        return () => {
            window.removeEventListener('resize', onResize);
            document.getElementById('moon-container').removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            <div id="moon-container" />
        </>
    );
};

export default MoonComponent;
