document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const colors = ['blue', 'yellow', 'green', 'red'];
    let positions = [];
    let moves = 0;

    // Crea la scacchiera e inizializza la partita
    function initializeGame() {
        board.innerHTML = '';
        positions = [];
        moves = 0;
        document.getElementById('moves').innerText = moves;
        document.getElementById('win-message').classList.add('hidden');

        for (let i = 0; i < 16; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.id = 'box-' + i;
            box.addEventListener('dragover', allowDrop);
            box.addEventListener('drop', drop);
            box.addEventListener('dragenter', dragEnter);
            box.addEventListener('dragleave', dragLeave);
            board.appendChild(box);
            positions.push(i);
        }

        shuffle(positions);
        for (let i = 0; i < 15; i++) {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.style.backgroundColor = colors[i % 4];
            ball.draggable = true;
            ball.id = 'ball-' + i;
            ball.addEventListener('dragstart', dragStart);
            ball.addEventListener('dragend', dragEnd);
            document.getElementById('box-' + positions[i]).appendChild(ball);
        }
    }

    // Funzione per mescolare l'array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Permetti il drop
    function allowDrop(event) {
        event.preventDefault();
    }

    // Inizio del drag
    function dragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
        setTimeout(() => {
            event.target.classList.add('hide');
        }, 0);
    }

    // Fine del drag
    function dragEnd(event) {
        event.target.classList.remove('hide');
    }

    // Drop della pallina
    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const ball = document.getElementById(data);
        if (isAdjacent(ball.parentNode, event.target)) {
            event.target.appendChild(ball);
            updateMoveCounter();
            checkWin();
        }
        event.target.classList.remove('over');
    }

    // Entra nel box
    function dragEnter(event) {
        if (isAdjacent(document.querySelector('.ball.hide').parentNode, event.target)) {
            event.target.classList.add('over');
        }
    }

    // Esce dal box
    function dragLeave(event) {
        event.target.classList.remove('over');
    }

    // Verifica se i box sono adiacenti
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

    // Aggiorna il contatore delle mosse
    function updateMoveCounter() {
        moves++;
        document.getElementById('moves').innerText = moves;
    }

    // Controlla se il giocatore ha vinto
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

        let win = colors.some(color => {
            return winPatterns.some(pattern => {
                return pattern.every(index => {
                    const ball = boxes[index].firstChild;
                    return ball && ball.style.backgroundColor === color;
                });
            });
        });

        if (win) {
            document.getElementById('win-message').classList.remove('hidden');
        }
    }

    // Inizializza la nuova partita
    document.getElementById('new-game').addEventListener('click', initializeGame);

    // Inizializza la prima partita
    initializeGame();
});
