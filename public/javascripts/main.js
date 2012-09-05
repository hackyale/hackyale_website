$(document).ready(function($) {
    
   // smooth scrolling
   $('.internal').click(function(e){
       e.stopPropagation();
       $target = $( $(this).attr('href') );
       offset = $target.offset().top - 51; //for header bar
       $('body').animate({scrollTop: offset}, 400);
   });
   
});

$(window).load(function(){
    $('body').animate({scrollTop: window.pageYOffset-51});
});

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
