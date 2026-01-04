// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Get DOM elements
const stateInput = document.getElementById('stateInput');
const fetchButton = document.getElementById('fetchButton');
const errorMessage = document.getElementById('error-message');
const weatherAlertsDiv = document.getElementById('weather-alerts');

// Event listener for the fetch button
if (fetchButton) {
  fetchButton.addEventListener('click', handleFetchAlerts);
}

// Main function to handle fetching and displaying alerts
async function handleFetchAlerts() {
  // Get the state abbreviation from input
  const stateAbbr = stateInput.value.trim().toUpperCase();
  
  // Clear error message
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
  
  // Clear previous weather alerts
  weatherAlertsDiv.innerHTML = '';
  
  // Build the URL
  const url = weatherApi + stateAbbr;
  
  try {
    // Fetch weather alerts
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Display the alerts
    displayWeatherAlerts(data);
    
    // Clear the input field
    stateInput.value = '';
    
  } catch (error) {
    // Display error message
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
}

// Function to display weather alerts
function displayWeatherAlerts(data) {
  // Get the title and number of alerts
  const title = data.title;
  const alertCount = data.features.length;
  
  // Create summary message
  const summaryText = `${title}: ${alertCount}`;
  const summaryDiv = document.createElement('div');
  summaryDiv.textContent = summaryText;
  weatherAlertsDiv.appendChild(summaryDiv);
  
  // Create list of alert headlines if there are any
  if (alertCount > 0) {
    const alertsList = document.createElement('ul');
    
    data.features.forEach(alert => {
      const headline = alert.properties.headline;
      const listItem = document.createElement('li');
      listItem.textContent = headline;
      alertsList.appendChild(listItem);
    });
    
    weatherAlertsDiv.appendChild(alertsList);
  }
}
