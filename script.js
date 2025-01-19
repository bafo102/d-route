console.log('a')

// make group sortable
$( function() {
    $( "#main" ).sortable({
      placeholder: "ui-state-highlight",
      handle: ".handle"
    });
} );

$( function() {
  $( ".shorcut-container" ).sortable({
    connectWith: ".shorcut-container"
  })
} );
