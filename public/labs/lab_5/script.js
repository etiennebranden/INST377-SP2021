function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  const mymap = L.map('mapid').setView([38.9897, -76.9378], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmV0aWVubmUiLCJhIjoiY2ttNnQ0am96MHJhbjJ3czM2YnphZHRqayJ9.qh2I2kvZQ8qenBPd5D4wYw'
}).addTo(mymap);
  console.log('mymap', mymap);
  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
  
  // Modified Assingment 1 code to better resemble lecture vidoes
  const form = document.querySelector('#search-form');
  const search = document.querySelector('#search');
  const targetlist = document.querySelector('.target-list');
  const replyMessage = document.querySelector('.reply-message');

  // Get data from api for restaurants
  const endpoint = '/api';
  const request = await fetch(endpoint);
  const restaurants = await request.json();

  // Have first 5 matches displayed and marked on map when pressing submit button
  form.addEventListener('submit', async (place) => {

    place.preventDefault();
    console.log('submit fired', search.value);

    const matches = restaurants.filter((restaurant) => restaurant.zip.includes(search.value) && restaurant.geocoded_column_1);
    const firstFive = matches.slice(0,5);

    // If no matches display a default message
    if (firstFive.length < 1) {
      replyMessage.classList.add('box');
      replyMessage.innerText = 'No matches found';
    } else {
      console.table(firstFive);
    
      
      firstFive.forEach((item) => {
        // Use the coordinates of each restaurant to mark them on the map
        const longLat = item.geocoded_column_1.coordinates;
        console.log('markerLongLat', longLat[0], longLat[1]);
        const marker = L.marker([longLat[1], longLat[0]]).addTo(mapObjectFromFunction);

        // Display the matched restaurants as a list
        /* Bug: when pressing submit multiple times, new results are concatenated to old results.
        Instead the new results should replace the old results
        */ 
        const appendItem = document.createElement('li');
        appendItem.classList.add('block');
        appendItem.classList.add('list-item');
        appendItem.innerHTML = `<div class="list-header is-size-5">${item.name}</div><address class="is-sized-6">${item.address_line_1}</address>`;
        targetlist.append(appendItem);
    });

    const {coordinates} = firstFive[0]?.geocoded_column_1;
    console.log('viewSet coords', coordinates);
    mapObjectFromFunction.panTo([coordinates[1],coordinates[0]],0);
    }
  });
}
  
async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;