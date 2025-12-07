/* ==============================================
   EDIT YOUR PARTICIPANTS HERE
   ============================================== */
const participants = [
    "Person 1",
    "Person 2",
    "Person 3",
    "Person 4",
    "Person 5",
    "Person 6",
    "Person 7",
    "Person 8",
    "Person 9",
    "Person 10",
    "Person 11",
    "Person 12",
    "Person 13",
    "Person 14",
    "Person 15"
];

// ------------------------------------------------
// LOGIC CODE
// ------------------------------------------------

// Check if we are in "Participant Mode" or "Landing Mode"
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        // Participant Mode: We have data to show
        document.getElementById('view-match-btn').classList.remove('hidden');
        document.getElementById('view-match-btn').textContent = "Tap to Reveal Your Match!";
    } else {
        // Landing Mode: Show option to become Host
        document.getElementById('error-msg').classList.remove('hidden');
    }
};

function showAdminPanel() {
    document.getElementById('landing-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('hidden');
}

// ------------------------------------------------
// ADMIN: GENERATE LINKS
// ------------------------------------------------
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateLinks() {
    let gifters = [...participants];
    let receivers = [...participants];
    let valid = false;

    // Shuffle until no one has themselves
    while (!valid) {
        receivers = shuffle([...participants]);
        valid = true;
        for (let i = 0; i < gifters.length; i++) {
            if (gifters[i] === receivers[i]) {
                valid = false;
                break;
            }
        }
    }

    const listDiv = document.getElementById('links-list');
    listDiv.innerHTML = '';
    listDiv.classList.remove('hidden');

    const baseUrl = window.location.href.split('?')[0];

    gifters.forEach((gifter, index) => {
        const receiver = receivers[index];
        
        // Create a simple JSON object and encode it to Base64
        // This hides the result from plain sight in the URL bar
        const pairData = JSON.stringify({ s: gifter, t: receiver });
        const encoded = btoa(pairData); 
        
        const personalLink = `${baseUrl}?data=${encoded}`;

        const item = document.createElement('div');
        item.className = 'link-item';
        item.innerHTML = `
            <h4>For: ${gifter}</h4>
            <input type="text" value="${personalLink}" readonly>
            <button class="copy-btn" onclick="copyToClipboard(this)">Copy Link</button>
        `;
        listDiv.appendChild(item);
    });
}

function copyToClipboard(btn) {
    const input = btn.previousElementSibling;
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(input.value);
    
    const originalText = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => btn.textContent = originalText, 2000);
}

// ------------------------------------------------
// PARTICIPANT: REVEAL GIFT
// ------------------------------------------------
function revealGift() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) return;

    try {
        // Decode the Base64 string
        const jsonString = atob(encodedData);
        const data = JSON.parse(jsonString);

        document.getElementById('landing-screen').classList.add('hidden');
        document.getElementById('reveal-screen').classList.remove('hidden');
        
        document.getElementById('santa-name').textContent = data.s; // The "Santa" (User)
        document.getElementById('target-name').textContent = data.t; // The "Target"
    } catch (e) {
        alert("Invalid link! Please ask the host to send it again.");
    }
}
