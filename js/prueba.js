const $board = $('#container');
function load(){for (let i = 0; i < 20; i++) {
    const $row = $('<div>').addClass('hijos');
    $board.append($row);
}
}
load();




$('.hijos').each(function(){
    var $this = $(this);
    var mc = new Hammer(this);
    mc.on("press", function() {
        console.log(this);
        alert('Double tap!');
        $this.addClass('ja');
        $this.toggleClass('liked');
        return false;
    });
});