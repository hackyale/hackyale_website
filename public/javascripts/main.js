$(document).ready(function($) {

   // smooth scrolling
   $('.internal').click(function(e){
       e.stopPropagation();
       $target = $( $(this).attr('href') );
       offset = $target.offset().top - 51; //for header bar
       $('body').animate({scrollTop: offset}, 400);
   });

   $('.read_more').click(function(e) {
     e.preventDefault();
     var that = $(this);
     var moreReading = that.parent().parent().find('.more_reading');
     that.text(toggleMoreLess(that, moreReading));

   });

});

$(window).load(function(){
    $('body').animate({scrollTop: window.pageYOffset-51});
});

function toggleMoreLess(el, moreReading) {
  var str = el.text();
  if (/more/.test(str)) {
    moreReading.append(el);
    moreReading.slideToggle();
    return str.replace('more', 'less');
  }
  else if (/less/.test(str)) {
    moreReading.slideToggle(function() {
      el.parent().parent().find('.role').append(el);
    });
    return str.replace('less', 'more');
  }
  else {
    return 'uh oh';
  }
}

HACKYALE_APP = {

	showError: function( response ) {
	  var errorMessage = response.responseText;
		$( '#flash-success' ).hide();
		$( '#flash-error p' ).html( errorMessage );
		$( '#flash-error' ).show();
	},

	showSuccess: function( response ) {
	  var successMessage = response.responseText;
		$( '#flash-error' ).css( 'display', 'none' );
		$( '#flash-success p' ).html( successMessage );
		$( '#flash-success' ).show();
		$('.right_section input').hide();
	}
}
