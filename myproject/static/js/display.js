var colCount = 0;
var colWidth = 0;
var margin = 20;
var spaceLeft = 0;
var windowWidth = 0;
var blocks = [];

// Scroll globals
var pageNum = 1; // The latest page loaded
var hasNextPage = true; // Indicates whether to expect another page after this one
//var rePos = false; // whether the floating divs need to be moved to bottom

// trigger these events when document is first loaded
$(document).ready(function(){
        $(window).resize(setupBlocks);
        $(window).bind('scroll', loadOnScroll);
	/*$(window).mousestop(setupBlocks);*/
});

//**************************** Window Resize ****************************************
// For Window Resizing shows visible divs move
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

// For Window Resizing shows visible divs move
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

//***********************************************************************
function setupBlocksScroll() {
    
    $('.infoColumn').hide();

    blocks = []

    windowWidth = $(window).width();
    colWidth = $('.infoColumn').outerWidth();
    colCount = Math.floor(windowWidth/(colWidth+margin));
    spaceLeft = (windowWidth - ((colWidth*colCount)+margin*2)) / 2;
    spaceLeft -= margin;

    for(var i=0;i<colCount;i++) {
        blocks.push(margin);
    }
    positionBlocksScroll();

    $('.infoColumn').show();

}

function positionBlocksScroll(){
    try{

        $('.infoColumn').each(function(){
                var min = Array.min(blocks);
                var index = $.inArray(min, blocks);
                var leftPos = margin+(index*(colWidth+margin));

                //hide block until ready
                $(this).hide();

                $(this).css('left', (leftPos+spaceLeft)+'px');
                $(this).css('top', min+'px');
                blocks[index] = min+$(this).outerHeight()+margin;

            });

        //show black when ready
        $('.infoColumn').each(function(){
                //show block when read
                $(this).show();
            });

        $('#centerBody').css('height', Array.max(blocks) + 'px');
    }
    catch(err){
        alert(err);
    }


    // show infocolumn
    $('.infoColumn2').attr("class", "infoColumn");
    $('.infoColumn').show();
}


// loadOnScroll handler
function loadOnScroll() {

    // If the current scroll position is past out cutoff point...
    if (($(window).scrollTop() > Array.min(blocks) - ($(window).height()*2)) /*&& $isScrollTrig = false*/) {
	// temporarily unhook the scroll event watcher so we don't call a bunch of times in a row
	setupBlocksScroll();
        $(window).unbind('scroll');                                                                                                                             
        //execute the load function below that will visit the JSON feed and stuff data into the HTML                                                     
        loadItems();
    }               

    else{
	setupBlocksScroll();
	
    }
    
}

var loadItems = function() {
    // If the next page doesn't exist, just quit now 
    if (hasNextPage === false) {
        return false
    }
    // Update the page number
    pageNum = pageNum + 1;
    // Configure the url we're about to hit
    $.ajax({
            url: '',
                data: {page: pageNum},
                dataType: 'json',
                success: function(data) {
                // Update global next page variable
                hasNextPage = true;//.hasNext;
                // Loop through all items
                
		//hide infocolumn2
		$('.infoColumn2').hide();

		/*$('#test).append($('<div></div>').attr('class', 'example'));*/

		for (i in data) {

		    //get the twitter script so tweet button will work
		    $.getScript("http://platform.twitter.com/widgets.js");

		    FB.init({
			    appId      : '495360990480155', // App ID
				channelUrl : 'https://www.redditpix.com', // Channel File
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
		    });

		    //append new infoColumns
		    $("#centerBody").append(
                        '<div class = "infoColumn2">' +
                        '<a rel="lightbox[pics]" title="'+ data[i].fields.title +'" href="'+ data[i].fields.link +'">' +
                        '<img src="' + data[i].fields.link + '" width="100%" />' +
                        '</a>' +
                        '<hr/>' +
                        '<h6 style = "margin: 15px 0px; padding: 0px;">' + data[i].fields.title +
                        '</br></br><a href="http://www.redditpix.com/' + data[i].fields.name + '" target="_blank">View Full-Size Image</a>' +
                        '</h6>' +
                        '<hr/>' +
			'<center style = "font-size: 10px;"><u>UpVotes: ' + data[i].fields.upVotes + '</u> | <u>' + 'DownVotes: ' + data[i].fields.downVotes + '</u></center>' +
                        '<div class = "columnSocial">' +

                        '<div class = "innerColumnSocial">' +
                        '<!-- Facebook Send -->' +
			
			'<div class="fb-send" style = "margin: 0px auto 0px auto;" data-href="http://www.redditpix.com/' + data[i].fields.name+'" data-font="arial"></div></div>' +
			 
                        '<div class = "innerColumnSocial">' +
                        '<!-- Twitter Tweet -->' +
                        '<center>' +
                        '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.redditpix.com/' + data[i].fields.name + '" data-via="@RedditPix" data-lang="en">Tweet</a>' +
                                '</center>' +
                                '<script>' +
                        '!function(d,s,id) {' +
                        'var js,fjs=d.getElementsByTagName(s)[0];' +
                        'if(!d.getElementById(id)){' +
                        'js=d.createElement(s);' +
                                                  'js.id=id;' +
                        'js.src="https://platform.twitter.com/widgets.js";' +
                        'fjs.parentNode.insertBefore(js,fjs);' +
                                              '}' +
                                          '}' +
                        '(document,"script","twitter-wjs");' +
                                '</script>' +
                        '</div>' +

			'</div>' +
                        '</div>'
                                            );
		    
                }
	        },
		error: function(data) {
                // When I get a 400 back, fail safely
                hasNextPage = false
		    },
		complete: function(data, textStatus){
                // Turn the scroll monitor back on
                $(window).bind('scroll', loadOnScroll);
            }
	});

    //changed
    $('.infoColumn2').hide();
    setupBlocksScroll()
};
    
// Function to get the Min value in Array
Array.min = function(array) {
    return Math.min.apply(Math, array);
};

Array.max = function(array) {
    return Math.max.apply(Math, array) + 50;
};