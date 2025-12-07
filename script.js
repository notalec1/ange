/* ==============================================
   EDIT YOUR PARTICIPANTS HERE
   Make sure every name has quotes "" around it
   and a comma , after it (except the last one).
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

window.onload = function() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');

        if (encodedData) {
            // If there is a code, we are in Participant Mode
            // 1. Show the reveal button
            const btn = document.getElementById('view-match-btn');
            if(btn) btn.classList.remove('hidden');

            // 2. Hide the host section so participants don't get confused
            const hostSec = document.getElementById('host-section');
            if(hostSec) hostSec.classList.add('hidden');
        } 
        // If no code, Host Section remains visible by default (HTML default)
    } catch (err) {
        console.error("Error loading page:", err);
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

    // Safety check to prevent infinite loops if array is too small
    if (participants.length < 2) {
        alert("You need at least 2 people to play!");
        return;
    }

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

    // Get current clean URL (removes any existing ?data=...)
    const baseUrl = window.location.href.split('?')[0];

    gifters.forEach((gifter, index) => {
        const receiver = receivers[index];
        
        // Encode data
        const pairData = JSON.stringify({ s: gifter, t: receiver });
        const encoded = btoa(pairData); 
        const personalLink = `${baseUrl}?data=${encoded}`;

        const item = document.createElement('div');
        item.className = 'link-item';
        item.innerHTML = `
            <h4>For: ${gifter}</h4>
            <input type="text" value="${personalLink}" readonly onclick="this.select()">
            <button class="copy-btn" onclick="copyToClipboard(this)">Copy Link</button>
        `;
        listDiv.appendChild(item);
    });
}

function copyToClipboard(btn) {
    const input = btn.previousElementSibling;
    input.select();
    input.setSelectionRange(0, 99999); // Mobile fix
    
    navigator.clipboard.writeText(input.value).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "#333";
        }, 2000);
    });
}

// ------------------------------------------------
// PARTICIPANT: REVEAL GIFT
// ------------------------------------------------
function revealGift() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) return;

    try {
        const jsonString = atob(encodedData);
        const data = JSON.parse(jsonString);

        document.getElementById('landing-screen').classList.add('hidden');
        document.getElementById('reveal-screen').classList.remove('hidden');
        
        document.getElementById('santa-name').textContent = data.s; 
        document.getElementById('target-name').textContent = data.t; 
    } catch (e) {
        alert("Invalid link! Please ask the host to send it again.");
        console.error(e);
    }
}
