/* ==============================================
   EDIT YOUR PARTICIPANTS HERE
   Make sure to keep the quotes and commas!
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
// LOGIC CODE (Do not edit below unless you know JS)
// ------------------------------------------------

let assignments = {};
let taken = new Set();

// Shuffle function (Fisher-Yates)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generate valid pairs (no self-assignments)
function generatePairs() {
    let gifters = [...participants];
    let receivers = [...participants];
    let valid = false;

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

    // Map the results
    assignments = {};
    gifters.forEach((gifter, index) => {
        assignments[gifter] = receivers[index];
    });

    return true;
}

function startNewGame() {
    generatePairs();
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('selection-screen').classList.remove('hidden');
    renderButtons();
}

function renderButtons() {
    const container = document.getElementById('name-list');
    container.innerHTML = '';
    
    participants.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.className = 'name-btn';
        if (taken.has(name)) {
            btn.classList.add('disabled');
        }
        btn.onclick = () => selectName(name);
        container.appendChild(btn);
    });

    if (taken.size === participants.length) {
        document.getElementById('selection-screen').classList.add('hidden');
        document.getElementById('end-screen').classList.remove('hidden');
    }
}

function selectName(name) {
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('reveal-screen').classList.remove('hidden');
    
    document.getElementById('santa-name').textContent = name;
    
    // Reset the gift box state
    const giftBox = document.querySelector('.gift-box');
    const targetName = document.getElementById('target-name');
    const instruction = document.querySelector('.click-instruction');
    const doneBtn = document.getElementById('done-btn');
    
    // Store current santa for logic
    giftBox.dataset.santa = name;
    
    targetName.classList.add('hidden-target');
    targetName.textContent = assignments[name];
    instruction.style.display = 'block';
    doneBtn.classList.add('hidden');
}

function revealTarget() {
    const targetName = document.getElementById('target-name');
    const instruction = document.querySelector('.click-instruction');
    const doneBtn = document.getElementById('done-btn');

    if (targetName.classList.contains('hidden-target')) {
        targetName.classList.remove('hidden-target');
        instruction.style.display = 'none';
        doneBtn.classList.remove('hidden');
    }
}

function resetScreen() {
    const giftBox = document.querySelector('.gift-box');
    const currentSanta = giftBox.dataset.santa;
    
    taken.add(currentSanta); // Mark this person as done
    
    document.getElementById('reveal-screen').classList.add('hidden');
    document.getElementById('selection-screen').classList.remove('hidden');
    renderButtons();
}
