$(document).ready(function() {
            
      $("form").submit(function(e){
                e.preventDefault(e);
      });
	  
	  $("input[name='email'],input[name='password']").on("focus",()=>{
	     hideValidate();
	  });
	  
});


function checkinputs(){
   window.location.replace("/monitor");
}
 
function validate1 (val) {
    if(val.length==0) {
	  return false;
    }else{
	  return true;
	}
}
 
function validate2(val){
    if(val.length==0){
	   return false;
	}else{
	   return true;
	}
}

function showValidate(val) {
    $("#cc").text(val);
	$("#cc").show();
}

function hideValidate() {
    $("#cc").hide();
}

function showmodal(){
  $("#txt").text("Please contact your administrator for resetting your password.");
  $(".simplemodal").modal('show');
}
    