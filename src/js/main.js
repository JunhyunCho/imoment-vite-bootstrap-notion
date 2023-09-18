// Import our custom CSS
//import '../scss/styles.scss'

// Import all of Bootstrap's JS
//import * as bootstrap from 'bootstrap'



let map;
let tourStops;
var myCarousel = document.querySelector('#myCarousel');
var carousel = new bootstrap.Carousel(myCarousel, {
    interval: 1000,
    wrap: false
});
//add eventListener to carousel
myCarousel.addEventListener('slide.bs.carousel', function (event) {
    //get the index of the slide
    var index = event.to;
    //get the slide itself
    //console.log(event.relatedTarget.id);
    map.panTo(tourStops[index].position);
    tourStops[index].marker.dropMarkerAnimation();
    

});



const DEMO_MAP_ID = "bf275fc383452ffe"
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Initialize and add the map
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 37.535, lng: 127.0035 },
        disableDefaultUI: true,
        mapId: "bf275fc383452ffe",
    });
    // Set LatLng and title text for the markers. The first marker (Boynton Pass)
    // receives the initial focus when tab is pressed. Use arrow keys to
    // move between markers; press tab again to cycle through the map controls.
    tourStops = [
        {
            position: { lat: 37.559, lng: 126.904 },
            title: "망원",
        },
        {
            position: { lat: 37.581, lng: 126.966 },
            title: "평창동",
        },
        {
            position: { lat: 37.486, lng: 126.991 },
            title: "사당동",
        },

    ];
    // Create an info window to share between markers.
    const infoWindow = new InfoWindow();

    // Create the markers.
    tourStops.forEach(({ position, title }, i) => {
        const pin = new PinElement({
            glyph: `${i + 1}`,
        });
        console.log(tourStops);
        const marker = new AdvancedMarkerElement({
            position,
            map,
            title: `${i + 1}. ${title}`,
            content: pin.element,
        });
        tourStops[i].marker = marker;

        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", ({ domEvent, latLng }) => {
            const { target } = domEvent;

            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
            //console.log("Marker clicked", target, latLng.toJSON());
            //move center of the map to latLng
            map.panTo(latLng);
            //slide carousel card to the right index
            carousel.to(i);
            console.log("carousel index", i);
        });

        //add marker animation
        dropMarkerAnimation();
     

        function dropMarkerAnimation() {
            const intersectionObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("drop");
                        intersectionObserver.unobserve(entry.target);
                    }
                }
            });

            const content = marker.content;

            content.style.opacity = "0";
            content.addEventListener("animationend", (event) => {
                content.classList.remove("drop");
                content.style.opacity = "1";

                //content.style.setProperty("--delay-time", 1 + "s");
                //intersectionObserver.observe(content);
            });

            content.style.setProperty("--delay-time", 0.2 + "s");
            intersectionObserver.observe(content);
        }


        marker.dropMarkerAnimation = dropMarkerAnimation;

    });

    const parser = new DOMParser();
    // A marker with a custom inline SVG.
    const pinSvgString =
        '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#7837FF"></rect><path d="M46.0675 22.1319L44.0601 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9402 33.2201L9.93262 33.8723" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 47.0046V44.8933" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 9V11.1113" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 43.3597L37.9186 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 12.6442L18.0816 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.93262 22.1319L11.9402 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M46.0676 33.8724L44.0601 33.2201" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 12.6442L37.9186 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 43.3597L18.0816 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#FF7878"></path></svg>';
    const newPinSvgString =
        '<svg width="50px" height="50px" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z" stroke="#1C274C" stroke-width="1.5"/><path d="M11.0429 11.5215L10.5891 12.1187H10.5891L11.0429 11.5215ZM12 7.71604L11.4719 8.24858C11.7643 8.53853 12.2357 8.53853 12.5281 8.24858L12 7.71604ZM12.9571 11.5215L13.4109 12.1187L12.9571 11.5215ZM12 12L12 11.25H12L12 12ZM11.4967 10.9244C11.0789 10.6069 10.6177 10.2097 10.2679 9.79085C9.90066 9.35108 9.75 8.99865 9.75 8.75734H8.25C8.25 9.53562 8.68177 10.2317 9.11649 10.7523C9.56863 11.2938 10.1288 11.7689 10.5891 12.1187L11.4967 10.9244ZM9.75 8.75734C9.75 8.13509 10.0269 7.87068 10.2497 7.78976C10.4873 7.7035 10.9433 7.72437 11.4719 8.24858L12.5281 7.1835C11.7068 6.36899 10.6627 6.044 9.73781 6.37982C8.79816 6.72098 8.25 7.64658 8.25 8.75734H9.75ZM13.4109 12.1187C13.8712 11.7689 14.4314 11.2938 14.8835 10.7523C15.3182 10.2317 15.75 9.53561 15.75 8.75733H14.25C14.25 8.99866 14.0993 9.3511 13.7321 9.79086C13.3824 10.2098 12.9211 10.6069 12.5034 10.9244L13.4109 12.1187ZM15.75 8.75733C15.75 7.64657 15.2018 6.72098 14.2622 6.37982C13.3373 6.044 12.2932 6.36899 11.4719 7.1835L12.5281 8.24858C13.0567 7.72437 13.5127 7.7035 13.7503 7.78976C13.9731 7.87068 14.25 8.13509 14.25 8.75733H15.75ZM10.5891 12.1187C10.9545 12.3964 11.3725 12.75 12 12.75L12 11.25C11.9808 11.25 11.9691 11.2515 11.9158 11.2223C11.8303 11.1756 11.7231 11.0964 11.4967 10.9244L10.5891 12.1187ZM12.5034 10.9244C12.2769 11.0964 12.1697 11.1756 12.0842 11.2223C12.0309 11.2515 12.0192 11.25 12 11.25L12 12.75C12.6275 12.75 13.0455 12.3964 13.4109 12.1187L12.5034 10.9244Z" fill="#1C274C"/></svg>';


    const pinSvg = parser.parseFromString(
        newPinSvgString,
        "image/svg+xml",
    ).documentElement;
    const pinSvgMarkerView = new AdvancedMarkerElement({
        map,
        position: { lat: 37.42475, lng: 126.994 },
        content: pinSvg,
        title: "A marker using a custom SVG image.",
    });

}

initMap();




