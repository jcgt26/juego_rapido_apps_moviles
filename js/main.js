$(document).ready(function () {
    console.log("Init");

});

// Conectarlo con index para que cambie segun la eleccion del jugador
const TOTALROWS = 10;
const TOTALCOLS = 10;
const $board = $("#board");


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
    $board.empty();
    for (let i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < columns; j++) {
            const $column = $('<div>').addClass('column hidden')
                .attr('data-column', j)
                .attr('data-row', i)
            if (Math.random() < 0.095) {
                $column.addClass('mine');
            }
            $board.append($column);
        }
        $board.append($row);
    }
}

///////////////////////////////////////////////////////////////////////////
// $('.column').each(function(){
//     var $this = $(this);
//     var mc = new Hammer(this);
//     mc.on("press", function() {
//         console.log('Double tap!');
//         alert('Double tap!');
//         $this.toggleClass('liked');
//         return false;
//     });
// });
//////////////////////////////////////////////////////////////////////////////////
loadBoard(TOTALROWS, TOTALCOLS);


function restart() {
    loadBoard(TOTALROWS, TOTALCOLS);
}
function gameOver(value) {
    let msg = null
    msg = value == true ? "☢GAME OVER☢" : "YOU WON!! 🐢🐢";
    $('.column.mine').addClass('mine_icon')

    setTimeout(() => {
        alert(msg);
        restart();
    }, 1000);
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
        }else if(mineNumb === 2){
            $cell.addClass('number_2');
        }else if(mineNumb === 3){
            $cell.addClass('number_3');
        }
        else{
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


$board.on('click', '.column.hidden', function () {
    const $cell = $(this);
    const row = $cell.data('row');
    const column = $cell.data('column');
    console.log(this);

    if ($cell.hasClass('mine')) {
        gameOver(true);
    } else {
        reveal(row, column);
        let isGameOver = $('.column.hidden').length === $('.column.mine').length ? false : true;
        if (isGameOver === false) {
            gameOver(false)
        }
    }

});