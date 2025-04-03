const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Function to store in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Function to get a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Function to clear local storage
function clearStorage() {
  localStorage.clear();
}

// Function to generate SHA-256 hash of a string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function getSHA256Hash() {
  let cached = retrieve('sha256');
  let originalPin = retrieve('originalPin');

  if (cached && originalPin) {
    return cached;
  }

  // Generate a new random PIN
  originalPin = getRandomArbitrary(MIN, MAX).toString();
  const hash = await sha256(originalPin);

  store('originalPin', originalPin);
  store('sha256', hash);
  
  return hash;
}

async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const originalPin = retrieve('originalPin');

  if (pin === originalPin) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
  }
  
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the test function to the button
document.getElementById('check').addEventListener('click', test);

main();
