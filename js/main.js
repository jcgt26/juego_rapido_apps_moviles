
// Conectarlo con index para que cambie segun la eleccion del jugador
var secciones = [];
var scores_array,nick_names = [];
var countTime = 0;
var intervalTime = 0;
lastTime = 0
TOTALROWS = 0;
TOTALCOLS = 0;
var firebaseConfig;
var dbRef;
var score;
var db;
$(document).ready(function () {
    for (let i = 1; i <= 9; i++) {
        secciones[i] = (document.getElementById('section_' + i + ''));
    }
    setTimeout(() => {
        selectSection(1);

    }, 2000);

    firebaseConfig = {
        apiKey: "AIzaSyDOP1idU_zKXBL3DphxZyx7sAVgH_NUBeU",
        authDomain: "salvacrushhtmlcssjs.firebaseapp.com",
        databaseURL: "https://salvacrushhtmlcssjs.firebaseio.com",
        projectId: "salvacrushhtmlcssjs",
        storageBucket: "",
        messagingSenderId: "518655206592",
        appId: "1:518655206592:web:856c4d114268f6f6"
    };
    firebase.initializeApp(firebaseConfig);
     db = firebase.firestore();
     readData();


});


const $board = $("#board");
var TOTALMINES = 0;
$('#btn_facil').click(() => {
    countTime = 0;
    intervalTime = setInterval(timeIt, 1000);
    TOTALROWS = 10;
    TOTALCOLS = 10;
    loadBoard(TOTALROWS, TOTALCOLS);



});

$('#btn_medio').click(() => {
    countTime = 0;
    intervalTime = setInterval(timeIt, 1000);

    TOTALROWS = 13;
    TOTALCOLS = 13;
    loadBoard(TOTALROWS, TOTALCOLS);
    $('.column.hidden').each(function () {
        $('.column').css({ "transition": "none" });
        $('.column').css({ "width": "22px", "height": "22px" });
        $('.column').css({ "transition": "all 0.5s" });
    });


});

$('#btn_dificil').click(() => {
    countTime = 0
    intervalTime = setInterval(timeIt, 1000);

    TOTALROWS = 16;
    TOTALCOLS = 16;
    loadBoard(TOTALROWS, TOTALCOLS);
    $('.column.hidden').each(function () {
        $('.column').css({ "transition": "none" });
        $('.column').css({ "width": "18px", "height": "18px" });
        $('.column').css({ "transition": "all 0.5s" });
    });

});

function timeIt() {
    countTime++;
    console.log(countTime);

}

function getMineNumb(i, j) {
    let Time = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= TOTALROWS || nj >= TOTALCOLS || nj < 0 || ni < 0) continue;
            const $cell = $(`.column.hidden[data-row=${ni}][data-column=${nj}]`)
            if ($cell.hasClass('mine')) Time++;
        }

    }
    return Time;
}


function loadBoard(rows, columns) {
    // console.log(board);
    TOTALMINES = 0;
    $board.empty();
    for (let i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < columns; j++) {
            const $column = $('<div>').addClass('column hidden ')
                .attr('data-column', j)
                .attr('data-row', i)
            if (Math.random() < 0.095) {
                $column.addClass('mine'); //adding mine
                TOTALMINES++;
            }
            $board.append($column);
        }
        $board.append($row);
    }
    console.log(TOTALMINES);
    updateMinesNumber();

    //// assign event click & hold click to board
    $('.column.hidden').each(function () {
        const $cell = $(this);
        const row = $cell.data('row');
        const column = $cell.data('column');
        var $this = $(this);
        var mc = new Hammer(this);
        mc.on("tap", function () {
            if ($cell.hasClass('mine')) {
                gameOver(true);
            } else {
                reveal(row, column);
                let isGameOver = $('.column.hidden').length === $('.column.mine').length ? false : true;

                if (isGameOver === false) {
                    gameOver(false);
                }

            }
            return false;
        });
    });

    $('.column.hidden').each(function () {
        var $this = $(this);
        var mc = new Hammer(this);
        mc.on("press", function () {

            $this.toggleClass('flag');
            if ($this.hasClass('mine')) {
                TOTALMINES--;
                updateMinesNumber();

            }
            return false;
        });
    });
}

///////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
// loadBoard(TOTALROWS, TOTALCOLS);


function restart(rows, cols) {
    loadBoard(rows, cols);
}
function gameOver(value) {
    let msg = null

    $('.column.mine').addClass('mine_icon')


    setTimeout(() => {
        value == true ? selectSection(6) : selectSection(7);
        restart(TOTALROWS, TOTALCOLS);

    }, 3000);
    clearInterval(intervalTime);
    $('#score_field').text(countTime);

}


function reveal(row, column) {

    //implement depht- first search (DFS) || check Breadth First Search (BFS)
    const visited = {};
    /////////////////////////////////////////////////////////////
    function helper(i, j) {
        if (i >= TOTALROWS || j >= TOTALCOLS || i < 0 || j < 0) return;
        const key = `${i} ${j}`;
        if (visited[key]) return;
        const $cell = $(`.column.hidden[data-row=${i}][data-column=${j}]`)
        const mineNumb = getMineNumb(i, j);

        if (!$cell.hasClass('hidden') || $cell.hasClass('mine')) {
            return;
        }
        $cell.removeClass('hidden');
        if (mineNumb === 1) {
            $cell.addClass('number_1');
            // $cell.text(mineNumb);
            // return;
        } else if (mineNumb === 2) {
            $cell.addClass('number_2');
        } else if (mineNumb === 3) {
            $cell.addClass('number_3');
        }
        else {
            return
        }
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                helper(i + di, j + dj)

            }

        }

    }
    /////////////////////////////////////////////////////////////////////////
    helper(row, column);

}

function updateMinesNumber() {
    $('#minesNumber').html(TOTALMINES)
}


function hide() {
    for (i in secciones) {
        secciones[i].classList.add("ocultar");

    }
}

function selectSection(target, ) {

    hide();
    secciones[target].classList.remove("ocultar");




}

function addData() {
    db.collection('scores').add({
        nick_name: $('#nameScore').val(),
        score: countTime
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function readData(){
    db.collection('scores').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data()["score"]);
                
                // scores_array.push(doc.data()["score"])
                // nick_names.push(doc.data()["nick_name"])

                
            });
        })
    
}

