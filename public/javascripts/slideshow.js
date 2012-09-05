$(document).ready(function($) {

   // slide show hooks
   SLIDESHOW.changeSlide("next");     
   SLIDESHOW.interval = setInterval(function() {
       SLIDESHOW.changeSlide("next");
   }, SLIDESHOW.slideshowSpeed);
   
   //preload images!
   $(SLIDESHOW.photos).each(function(){
       $('<img/>').attr("src","/images/" + this["image"]);
    });

});


SLIDESHOW = {
    /**
       * slideshow code
       * based on http://www.marcofolio.net/webdesign/advanced_jquery_background_image_slideshow.html
    */                      
       photos : [{
   				image: "backgrounds/bg1.jpg"
   		}, {
   				image: "backgrounds/bg2.jpg"
   		}, {
   				image: "backgrounds/bg4.jpg"
   		}, {
   	      image: "backgrounds/bg3.jpg"
   		}],

       slideshowSpeed : 8500,
       interval : '',                    
       activeContainer : 1,
       currentImg : 0,
       animating : false,               

       changeSlide : function(direction) {
           // Check if no animation is running. If it is, prevent the action
           if(SLIDESHOW.animating) { return; }
           SLIDESHOW.currentImg++;
           if(SLIDESHOW.currentImg == SLIDESHOW.photos.length+1) {
               SLIDESHOW.currentImg = 1;
           }

           // Check which container we need to use
           var currentContainer = SLIDESHOW.activeContainer;
           if(SLIDESHOW.activeContainer == 1) {
               SLIDESHOW.activeContainer = 2;
           } else {
               SLIDESHOW.activeContainer = 1;
           }

           SLIDESHOW.showImage(SLIDESHOW.photos[SLIDESHOW.currentImg - 1], currentContainer, SLIDESHOW.activeContainer);                          
       },

       showImage : function(photoObject, currentContainer, activeContainer) {
           SLIDESHOW.animating = true;                          
           
            $("#bgimg" + currentContainer).css('z-index', '-1');
            
           $("#bgimg" + activeContainer).css({
               "display" : "block",
               "z-index" : '-2'
           }).attr({'src' : "/images/" + photoObject.image});    
             
           $("#bgimg" + currentContainer).fadeOut(1000, function() {
               setTimeout(function() {
                   SLIDESHOW.animating = false; 
               }, 800);
           });
       } 
}


                 
