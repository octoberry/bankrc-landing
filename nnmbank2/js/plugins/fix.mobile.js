var $body = $('body');
// app img animation
var $appImg = $('#phone1');
var $appImgBlock = $('#phone1_block');
var $appImg2 = $('#phone2');
var $appImg2Block = $('#phone2_block');
var topOff = 0;
var topOff2 = 0;
var scrolledWin = 0;
var winH, winW, fixTop1, fixTop2, fixMiddlePosition1, fixMiddlePosition2, iInfoTop, iAdvantTop;
var $window = $(window);

$(document).ready(function () {
    init();
});

function init() {
    // get window dimensions
    adjustWindow();
    $window.resize(function () {
        adjustWindow();
    });

    // handle scrolling
    $window.scroll(function () {
        handleScroll();
    });
}

// handle scroll
function handleScroll() {
    scrolledWin = getPageScroll();
    $body.addClass('scrolling');

    // show logo
    if ((scrolledWin * 1.5) > winH) {
        $body.addClass('content');
    }

    // show navigation 
    if (scrolledWin > 50) {
        $body.addClass('scrolled');
    }

    // app img animation
    if (topOff >= scrolledWin) {
        $appImg.removeClass('sticky');
        $appImg.css({top: ""});
        
        $appImg2.find("img").addClass("is-hide");
        $appImg2.removeClass('sticky');
    } else {
        $appImg.addClass('sticky');
        $appImg.css({top: (fixMiddlePosition1 + (scrolledWin - iInfoTop)) + "px"});
        
        $appImg2.addClass('sticky');
        $appImg2.find("img").removeClass("is-hide");
        $appImg2.css({top: (fixMiddlePosition2 + (scrolledWin - iAdvantTop - fixTop2)) + "px"});
    }
    if (topOff2 <= scrolledWin) {
        $appImg2.removeClass('sticky');
        $appImg2.css({top: ""});
    } else {
        
    }
    
}

// app img animation
function topOffs() {
    if ($appImg.find("*[data-fix="+$appImg.attr("id")+"]").height()){
        fixMiddlePosition1 = ((winH / 2) - ($appImg.find("*[data-fix="+$appImg.attr("id")+"]").height() / 2));
        
        if ($appImg2.find("*[data-fix="+$appImg2.attr("id")+"]").height()){
            fixMiddlePosition2 = ((winH / 2) - ($appImg2.find("*[data-fix="+$appImg2.attr("id")+"]").height() / 2));
            
            topOff = $appImgBlock.offset();
            topOff = topOff.top - fixMiddlePosition1;
            topOff2 = $appImg2Block.offset();
            topOff2 = topOff2.top - fixMiddlePosition2;

            fixTop1 = ($("#interface-info-block").offset().top - $("#is-interface-info").offset().top);
            iInfoTop = $("#is-interface-info").offset().top;

            fixTop2 = ($("#advantage-info-block").offset().top - $("#is-advantage-info").offset().top);
            iAdvantTop = $("#is-advantage-info").offset().top;
        } else {
            setTimeout(function(){topOffs();}, 100);
        }
        
    } else {
        setTimeout(function(){topOffs();}, 100);
    }
    
}

// get Page scroll	
function getPageScroll() {
    var yScroll;
    if (self.pageYOffset) {
        yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
        yScroll = document.documentElement.scrollTop;
    } else if (document.body) {// all other Explorers
        yScroll = document.body.scrollTop;
    }
    return yScroll;
}

// set image and window dimensions
function adjustWindow() {
    // get window size
    winW = $(window).width();
    winH = $(window).height();

    // app img animation
    topOffs();
    
    handleScroll();
}
