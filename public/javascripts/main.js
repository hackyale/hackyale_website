//Our main fb_data object

var FBdata = { 
  'lists' : [],
  'people' : [],
  'filter' : { 
    'include' : [],
    'exclude' : [],
  }
};

//Document Hooks
$(document).ready( function() {

  $("#fb_login").click( fbLogin );

  $('#fb_lists').delegate("input", "click", function(){
    checkBoxChecked( this );
  });

  $('#fb_friends').delegate('img', 'click', function(){
    window.open('//facebook.com/' + $(this).attr('rel'), '_blank');  
  });


});


//Attempt Facebook login
function fbLogin() {
  $('#failed').hide();
  $("span.button-text").html("Logging you in...");	
  FB.login( 
    function(response){
      if (response.authResponse) {
        loginSuccess( response.authResponse );
      } else {
        $("span.button-text").html("Connect with Facebook");
        $('#failed').show();
      }
    }, {scope:'read_friendlists, manage_friendlists, friends_hometown, friends_location, friends_relationships, user_work_history, user_education_history, friends_work_history, friends_education_history, '}
  );
}

// Facebook login was successful
function loginSuccess( auth ) { 
  $('#logout').show();
  $('#start').hide();
  $('#success').show();

  FBdata.uid = auth.UserID;
  FBdata.token = auth.accessToken;

  //get lists data
  fQuery("SELECT flid, owner, name FROM friendlist WHERE owner=me()", saveLists);

  //get people data
  fQuery("SELECT uid, name, pic_square FROM user WHERE uid = me() OR uid IN (SELECT uid2 FROM friend WHERE uid1 = me())", savePeople);
}


// Save friend lists, then grab uids for each list
function saveLists( resp ){
  //iterate over result data, saving each list
  _.map(resp.data, function(l){
    FBdata.lists.push( { 'flid' : l.flid, 'name': l.name, 'people' : [] } );
  });

  //then batch pull and friend ids for each list
  fQuery("SELECT uid, flid FROM friendlist_member WHERE flid IN (SELECT flid FROM friendlist WHERE owner=me())", saveListFriends);
}


// Save friends for each list
function saveListFriends( resp ){
  
  //iterate over results, saving all friends
  _.map(resp.data, function(f){
    _.find(FBdata.lists, function(l){ return l.flid === f.flid}).people.push( f.uid );
  });

  //then draw the lists on left panel
  insertListControl();

}

// Save friends!
function savePeople( resp ){
  FBdata.people = FBdata.people.concat( resp.data );

  //and preload images
  $(FBdata.people).each(function(){
    $('<img/>').attr("src",this.pic_square);
  });

  updateFaces();
}


//performs FQL query 'q', and calls successfunction with response
function fQuery( q, sfunc ){
  $.ajax({
    url: "https://graph.facebook.com/fql",
    dataType: 'json',
    data: { 'access_token' : FBdata.token, 'q' : q },
    success: sfunc,
    error: function(){
      alert('Sorry, there was an error communicating with Facebook!');
      data = {};
    }
  });
}


//inserts lists on left panel
function insertListControl(){
  FBdata.lists = _.sortBy( FBdata.lists, function(l){ return l.people.length }).reverse();
  _.map(FBdata.lists, function(l){
    var $new_div = $('#list_clone').clone().attr("id", l.flid);
    $new_div.find('h3').text( l.name + " (" + l.people.length + ")"  );
    $new_div.appendTo('#fb_lists').show();
  });

}

//handles click on checkbox
function checkBoxChecked( obj ){
  $(obj).parents('.fblist').find('input').not(obj).attr('checked', false);

  updateFilterWithList( $(obj).parents('.fblist').attr('id') );
}

//adds or removes list from filter. 
function updateFilterWithList( flid ){
  var c = $('#' + flid ).find('input:checked');

  var status;
  if ( c.length > 0 ) 
  status = c.val();
  else 
  status = '';

  var i = FBdata.filter.include;
  var e = FBdata.filter.exclude;

  i = _.without(i, flid);
  e = _.without(e, flid);

  if ( status === 'yes' )
  i.push(flid);
  if ( status === 'no' )
  e.push(flid);

  FBdata.filter.include = i;
  FBdata.filter.exclude = e; 

  updateFaces();
}

//updates faces display
function updateFaces(){
  $('#fb_friends').html("");

  var include = [];
  var include_lists = [];
  include = include.concat( _.pluck(FBdata.people, 'uid') );
  _.each( FBdata.filter.include, function(flid){
    var lobj =  _.find(FBdata.lists, function(l){ return l.flid === flid} );
    include_lists.push( lobj.name );
    include = _.intersection( include, lobj.people );
  });

  var exclude = [];
  var exclude_lists = [];
  _.each( FBdata.filter.exclude, function(flid){
    var lobj = _.find(FBdata.lists, function(l){ return l.flid === flid} );
    exclude_lists.push( lobj.name );
    exclude = exclude.concat( lobj.people );
  });

  var net = _.difference( include, exclude );

  _.each( net, function(uid){
    var friend = _.find( FBdata.people, function(p){ return p.uid === uid } );

    if ( typeof(friend.lists) === "undefined" || friend.lists.length === 0)
    friend.lists = _.filter(FBdata.lists, function(l){ return _.include(l.people, uid) });
    var ct = _.pluck(friend.lists, 'name').join(", ");

    var i = $('<img />').attr('src', friend.pic_square ).appendTo('#fb_friends').attr("title", friend.name);
    i.attr('data-content', ct).attr('rel', uid);
    i.popover({
      'placement' : 'below'
    });

  });

  $('#filter_status').html("Showing <strong>" + net.length + "</strong> friends.");

  var hint = "[ all friends ";

  if (include_lists.length > 0){
    hint += "in " + include_lists.join(" AND ");
    var exjoin = ' BUT NOT in ';
  } else {
    var exjoin = ' NOT in ';
  }

  if (exclude_lists.length > 0) 
  hint += exjoin + exclude_lists.join(" NOR ");

  hint += ' ]'  
  $('#filter_hint').text(hint)
}