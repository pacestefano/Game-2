document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    let positions = [];
    let moves = 0;
    let draggedSquare = null;
    let timerInterval = null;
    let startTime = null;
    const maxTime = 120; // 2 minutes in seconds
    const minMoves = 15; // This is a placeholder. We'll assume the minimum number of moves is 15;
    const moveSound = document.getElementById('move-sound'); // Reference to the audio element

    function initializeGame() {
        board.innerHTML = '';
        positions = [];
        moves = 0;
        document.getElementById('moves').innerText = moves;
        document.getElementById('win-message').classList.add('hidden');
        document.getElementById('timeout-message').classList.add('hidden');
        document.getElementById('timer').innerText = 'Timer: 00:00';
        document.getElementById('min-moves').innerText = `Numero minimo di mosse necessarie: ${minMoves}`;
        document.getElementById('progress-bar').style.width = '100%';

        clearInterval(timerInterval);
        startTime = null;

        for (let i = 0; i < 16; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.id = 'box-' + i;
            box.addEventListener('dragover', allowDrop);
            box.addEventListener('drop', drop);
            box.addEventListener('dragenter', dragEnter);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('touchstart', touchStart, { passive: false });
            box.addEventListener('touchmove', touchMove, { passive: false });
            box.addEventListener('touchend', touchEnd, { passive: false });
            board.appendChild(box);
            positions.push(i);
        }

        shuffle(positions);
        for (let i = 0; i < 15; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.style.backgroundColor = colors[i % 4];
            square.draggable = true;
            square.id = 'square-' + i;
            square.addEventListener('dragstart', dragStart);
            square.addEventListener('dragend', dragEnd);
            square.addEventListener('touchstart', touchStart, { passive: false });
            square.addEventListener('touchmove', touchMove, { passive: false });
            square.addEventListener('touchend', touchEnd, { passive: false });
            document.getElementById('box-' + positions[i]).appendChild(square);
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function dragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
        setTimeout(() => {
            event.target.classList.add('hide');
        }, 0);

        if (!startTime) {
            startTimer();
        }
    }

    function dragEnd(event) {
        event.target.classList.remove('hide');
    }

    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const square = document.getElementById(data);
        if (isAdjacent(square.parentNode, event.target) && !event.target.hasChildNodes()) {
            event.target.appendChild(square);
            updateMoveCounter();
            checkWin();
            moveSound.play(); // Play the move sound
        }
        event.target.classList.remove('over');
    }

    function dragEnter(event) {
        if (isAdjacent(document.querySelector('.square.hide').parentNode, event.target)) {
            event.target.classList.add('over');
        }
    }

    function dragLeave(event) {
        event.target.classList.remove('over');
    }

    function isAdjacent(box1, box2) {
        const id1 = parseInt(box1.id.split('-')[1]);
        const id2 = parseInt(box2.id.split('-')[1]);
        const row1 = Math.floor(id1 / 4);
        const row2 = Math.floor(id2 / 4);
        const col1 = id1 % 4;
        const col2 = id2 % 4;

        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    }

    function updateMoveCounter() {
        moves++;
        document.getElementById('moves').innerText = moves;
    }

    function checkWin() {
        const boxes = Array.from(document.getElementsByClassName('box'));
        const winPatterns = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
            [12, 13, 14, 15],
            [0, 4, 8, 12],
            [1, 5, 9, 13],
            [2, 6, 10, 14],
            [3, 7, 11, 15],
            [0, 5, 10, 15],
            [3, 6, 9, 12]
        ];

        const checkPattern = (pattern, color) => pattern.every(index => {
            const square = boxes[index].firstChild;
            return square && square.style.backgroundColor === color;
        });

        let win = colors.some(color => {
            return winPatterns.some(pattern => {
                return checkPattern(pattern, color);
            });
        });

        if (win) {
            document.getElementById('win-message').classList.remove('hidden');
            clearInterval(timerInterval);
        }
    }

    function checkTimeout() {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const remainingTime = maxTime - elapsedTime;
        const progressBar = document.getElementById('progress-bar');

        if (remainingTime <= 0) {
            document.getElementById('timeout-message').classList.remove('hidden');
            clearInterval(timerInterval);
        }

        const percentage = Math.max((remainingTime / maxTime) * 100, 0);
        progressBar.style.width = `${percentage}%`;
    }

    function touchStart(event) {
        event.preventDefault();
        draggedSquare = event.target;
        draggedSquare.classList.add('dragging'); // Feedback visivo
        disableScroll(); // Disabilita lo scrolling durante il tocco

        if (!startTime) {
            startTimer();
        }
    }

    function touchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('box') && isAdjacent(draggedSquare.parentNode, element)) {
            element.classList.add('over');
        }
    }

    function touchEnd(event) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('box') && isAdjacent(draggedSquare.parentNode, element) && !element.hasChildNodes()) {
            element.appendChild(draggedSquare);
            updateMoveCounter();
            checkWin();
            moveSound.play(); // Play the move sound
        }
        draggedSquare.classList.remove('dragging'); // Rimuovi feedback visivo
        enableScroll(); // Abilita nuovamente lo scrolling dopo il tocco
        document.querySelectorAll('.box').forEach(box => box.classList.remove('over'));
    }

    function startTimer() {
        startTime = new Date();
        timerInterval = setInterval(() => {
            updateTimer();
            checkTimeout();
        }, 1000);
    }

    function updateTimer() {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('timer').innerText = `Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function disableScroll() {
        window.addEventListener('touchmove', preventDefault, { passive: false });
    }

    function enableScroll() {
        window.removeEventListener('touchmove', preventDefault, { passive: false });
    }

    function preventDefault(event) {
        event.preventDefault();
    }

    document.getElementById('new-game').addEventListener('click', initializeGame);
    initializeGame();
});
