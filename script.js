<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gioco delle Palline</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="container">
        <div id="board"></div>
        <div id="sidebar">
            <div id="move-counter">
                <h2>Mosse: <span id="moves">0</span></h2>
            </div>
            <div id="win-message" class="hidden">
                <h2>Well done! Partita finita</h2>
            </div>
            <button id="new-game">Inizia nuova partita</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
