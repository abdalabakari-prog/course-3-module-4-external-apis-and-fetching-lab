// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Get DOM elements
const stateInput = document.getElementById('stateInput');
const fetchButton = document.getElementById('fetchButton');
const errorMessage = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const weatherAlertsDiv = document.getElementById('weather-alerts');

// Function to fetch weather alerts for a given state
async function fetchWeatherAlerts(stateAbbr) {
  const url = `https://api.weather.gov/alerts/active?area=${stateAbbr}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to display weather alerts
function displayWeatherAlerts(data) {
  // Clear previous content
  weatherAlertsDiv.innerHTML = '';
  
  // Get the title and number of alerts
  const title = data.title;
  const alertCount = data.features.length;
  
  // Create summary message
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'alert-summary';
  summaryDiv.textContent = `${title}: ${alertCount}`;
  weatherAlertsDiv.appendChild(summaryDiv);
  
  // Check if there are alerts
  if (alertCount === 0) {
    const noAlertsDiv = document.createElement('div');
    noAlertsDiv.className = 'no-alerts';
    noAlertsDiv.textContent = '✅ No active alerts for this state!';
    weatherAlertsDiv.appendChild(noAlertsDiv);
    return;
  }
  
  // Create list of alert headlines
  const alertsList = document.createElement('ul');
  alertsList.className = 'alerts-list';
  
  data.features.forEach(alert => {
    const headline = alert.properties.headline;
    const listItem = document.createElement('li');
    listItem.textContent = headline;
    alertsList.appendChild(listItem);
  });
  
  weatherAlertsDiv.appendChild(alertsList);
}

// Function to display error message
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

// Function to clear error message
function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('show');
}

// Function to show loading indicator
function showLoading() {
  loadingDiv.classList.add('show');
  fetchButton.disabled = true;
}

// Function to hide loading indicator
function hideLoading() {
  loadingDiv.classList.remove('show');
  fetchButton.disabled = false;
}

// Function to validate state input
function validateStateInput(input) {
  const trimmed = input.trim().toUpperCase();
  
  if (trimmed === '') {
    return { valid: false, error: 'Please enter a state abbreviation' };
  }
  
  if (trimmed.length !== 2) {
    return { valid: false, error: 'State abbreviation must be 2 characters' };
  }
  
  if (!/^[A-Z]{2}$/.test(trimmed)) {
    return { valid: false, error: 'State abbreviation must contain only letters' };
  }
  
  return { valid: true, value: trimmed };
}

// Main function to handle fetching and displaying alerts
async function handleFetchAlerts() {
  // Get and validate input
  const validation = validateStateInput(stateInput.value);
  
  if (!validation.valid) {
    displayError(validation.error);
    return;
  }
  
  const stateAbbr = validation.value;
  
  // Clear error message
  clearError();
  
  // Clear previous weather alerts
  weatherAlertsDiv.innerHTML = '';
  
  // Show loading indicator
  showLoading();
  
  try {
    // Fetch weather alerts
    const data = await fetchWeatherAlerts(stateAbbr);
    
    // Display the alerts
    displayWeatherAlerts(data);
    
    // Clear the input field
    stateInput.value = '';
    
  } catch (error) {
    // Display error message
    displayError(error.message);
  } finally {
    // Hide loading indicator
    hideLoading();
  }
}

// Event listener for the fetch button
if (fetchButton) {
  fetchButton.addEventListener('click', handleFetchAlerts);
}

// Event listener for Enter key in input field
if (stateInput) {
  stateInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleFetchAlerts();
    }
  });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayWeatherAlerts,
    handleFetchAlerts,
    displayError,
    clearError,
    validateStateInput
  };
}
// Your code here!
