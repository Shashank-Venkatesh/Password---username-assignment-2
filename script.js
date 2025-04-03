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
function getRandomPin() {
    return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
}

// Function to generate SHA-256 hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Function to generate and store the hashed PIN
async function getSHA256Hash() {
    let storedHash = retrieve('sha256');
    let storedPin = retrieve('originalPin');

    if (storedHash && storedPin) {
        return storedHash;
    }

    // Generate a new random PIN
    storedPin = getRandomPin().toString();
    const hash = await sha256(storedPin);

    store('originalPin', storedPin);
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
        resultView.innerHTML = '💡 Enter a 3-digit PIN!';
        resultView.classList.add('error');
        resultView.classList.remove('hidden', 'success');
        return;
    }

    const storedPin = retrieve('originalPin');

    if (pin === storedPin) {
        resultView.innerHTML = '🎉 Success!';
        resultView.classList.add('success');
        resultView.classList.remove('error');
    } else {
        resultView.innerHTML = '❌ Failed! Try again.';
        resultView.classList.add('error');
        resultView.classList.remove('success');
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
