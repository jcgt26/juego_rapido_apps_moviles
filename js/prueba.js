$('.tittle').each(function(){
    var $this = $(this);
    var mc = new Hammer(this);
    mc.on("press", function() {
        console.log('Double tap!');
        alert('Double tap!');
        $this.toggleClass('liked');
        return false;
    });
});