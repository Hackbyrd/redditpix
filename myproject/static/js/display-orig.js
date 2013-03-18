var colCount = 0;
var colWidth = 0;
var margin = 20;
var spaceLeft = 0;
var windowWidth = 0;
var blocks = [];

$(function(){
	$(window).resize(setupBlocks);
});

function setupBlocks() {

    blocks = []

    windowWidth = $(window).width();
    colWidth = $('.infoColumn').outerWidth();
    colCount = Math.floor(windowWidth/(colWidth+margin));
    spaceLeft = (windowWidth - ((colWidth*colCount)+margin*2)) / 2;
    spaceLeft -= margin;

    for(var i=0;i<colCount;i++) {
        blocks.push(margin);
    }
    positionBlocks();

}

function positionBlocks(){
    try{
    $('.infoColumn').each(function(){
	    var min = Array.min(blocks);
	    var index = $.inArray(min, blocks);
	    var leftPos = margin+(index*(colWidth+margin));
	    $(this).css('left', (leftPos+spaceLeft)+'px');
	    $(this).css('top', min+'px');
	    blocks[index] = min+$(this).outerHeight()+margin;
	});
    $('#centerBody').css('height', Array.max(blocks) + 'px');
    }
    catch(err){
	alert(err);
    }
}

// Function to get the Min value in Array
Array.min = function(array) {
    return Math.min.apply(Math, array);
};

Array.max = function(array) {
    return Math.max.apply(Math, array);
};