
// Conectarlo con index para que cambie segun la eleccion del jugador
var secciones = [];

$(document).ready(function () {
    for (let i = 1; i <= 8; i++) {
        secciones[i] = (document.getElementById('section_' + i + ''));
    }
    setTimeout(() => {
            selectSection(1);

    }, 2000);
 

});

var TOTALROWS = 10;
var TOTALCOLS = 10;
const $board = $("#board");

var TOTALMINES = 0;
$('#btn_medio').click(() => {
    let TOTALROWS = 13;
    let TOTALCOLS = 13;
    restart(TOTALROWS,TOTALCOLS)
    $('.column.hidden').each(function () {
        $('.column').css({"width": "19px", "height": "19px"});
    });
});

$('#btn_dificil').click(() => {
    let TOTALROWS = 15;
    let TOTALCOLS = 15;
    restart(TOTALROWS, TOTALCOLS);
    $('.column.hidden').each(function () {
        $('.column').css({"width": "13px", "height": "13px"});
    });
});


function getMineNumb(i, j) {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= TOTALROWS || nj >= TOTALCOLS || nj < 0 || ni < 0) continue;
            const $cell = $(`.column.hidden[data-row=${ni}][data-column=${nj}]`)
            if ($cell.hasClass('mine')) count++;
        }

    }
    return count;
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
                    gameOver(false)
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
loadBoard(TOTALROWS, TOTALCOLS);


function restart(rows, cols) {
    loadBoard(rows, cols);
}
function gameOver(value) {
    let msg = null

    $('.column.mine').addClass('mine_icon')


    setTimeout(() => {
        value == true ? selectSection(6) : selectSection(7);
        restart(TOTALROWS,TOTALCOLS);

    }, 3000);

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

function selectSection(target,) {
    // loadBoard(TOTALROWS,TOTALCOLS)
    hide();
    secciones[target].classList.remove("ocultar");



}

