document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const colors = ['blue', 'yellow', 'green', 'red'];
    let positions = [];
    let moves = 0;
    let draggedBall = null;

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
            box.addEventListener('touchstart', touchStart);
            box.addEventListener('touchmove', touchMove);
            box.addEventListener('touchend', touchEnd);
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
            ball.addEventListener('touchstart', touchStart);
            ball.addEventListener('touchmove', touchMove);
            ball.addEventListener('touchend', touchEnd);
            document.getElementById('box-' + positions[i]).appendChild(ball);
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
    }

    function dragEnd(event) {
        event.target.classList.remove('hide');
    }

    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const ball = document.getElementById(data);
        if (isAdjacent(ball.parentNode, event.target) && !event.target.hasChildNodes()) {
            event.target.appendChild(ball);
            updateMoveCounter();
            checkWin();
        }
        event.target.classList.remove('over');
    }

    function dragEnter(event) {
        if (isAdjacent(document.querySelector('.ball.hide').parentNode, event.target)) {
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

    // Funzioni per il touch
    function touchStart(event) {
        draggedBall = event.target;
        event.target.classList.add('hide');
    }

    function touchMove(event) {
        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('box') && isAdjacent(draggedBall.parentNode, element)) {
            element.classList.add('over');
        }
    }

    function touchEnd(event) {
        const touch = event.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('box') && isAdjacent(draggedBall.parentNode, element) && !element.hasChildNodes()) {
            element.appendChild(draggedBall);
            updateMoveCounter();
            checkWin();
        }
        draggedBall.classList.remove('hide');
        document.querySelectorAll('.box').forEach(box => box.classList.remove('over'));
    }

    document.getElementById('new-game').addEventListener('click', initializeGame);
    initializeGame();
});
