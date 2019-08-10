$(document).ready(function () {
    console.log("Init");

});
const TOTALROWS = 10;
const TOTALCOLS = 10;
const $board = $("#board");

function loadBoard(rows, columns) {
    $board.empty();
    for (let i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < columns; j++) {
            const $column = $('<div>').addClass('column hidden')
                .attr('data-column', j)
                .attr('data-row', i);
            if (Math.random() < 0.095) {
                $column.addClass('mine');
            }
            $board.append($column);
        }
        $board.append($row);
    }
}
loadBoard(TOTALROWS, TOTALCOLS);


function restart() {
    loadBoard(TOTALROWS, TOTALCOLS);
}
function gameOver(value) {
    let msg = null
    msg = value == true ? "☢GAME OVER☢" : "YOU WON!! 🐢🐢";
    alert(msg)
    restart();
}
function reveal(row, column) {
    const seen = {};
    function helper(i, j) {
        if(i>= TOTALROWS || j>= TOTALCOLS || i < 0 || j < 0)return;
        const key  = `${i} ${j}`;
        if(seen[key]) return;
        // const $cell = $(`.column.hidden[data-row=${i}][data-column=${j}]`)
    }
    helper(row,column);

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
    }

});