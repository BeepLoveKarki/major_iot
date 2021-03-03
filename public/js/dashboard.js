let num=7;

let mousePos = 0;
let currentPos = 0;
let position = 0;
let draggable = false;
let blockAnimeAdd, countAnimePlus = anime.timeline(), countAnimeMinus = anime.timeline();
let offset = 130;
let direction;
let dur = 2000;
let count = parseInt($('.active').text());

/*$(document).on('mousedown', '.stepper', function () {
    currentPos = mousePos;

    draggable = true;
    blockAnime.pause();

    if ($('.first').hasClass('active')) {
        $('.first').removeClass('active').addClass('next');
        $('.second').removeClass('next').addClass('active');
    } else if ($('.second').hasClass('active')) {
        $('.second').removeClass('active').addClass('next');
        $('.first').removeClass('next').addClass('active');
    }

    if (direction == 'plus') {
        countAnimePlus.pause();
    }

    if (direction == 'minus') {
        countAnimeMinus.pause();        
    }
})  

$(document).on("mousemove", function (event) {
    mousePos = event.pageY;

    if (draggable) {
        position = mousePos - currentPos;
        $('.stepper').css('transform', 'translateY(' + position / 2 + 'px)');
    }

    if (position <= (offset * -1) && draggable) {
        center();
        count++;
        plus();
    }

    if (position >= offset && draggable) {
        center();
        count--;
        minus();
    }
});

$(document).on("mouseup", function (event) {
    if (draggable) {
        center();
    }
});*/


function center() {
    draggable = false;
    blockAnime = anime({
        targets: '.stepper',
        duration: dur,
        translateY: 0,
    });
}

function plus() {
    direction = 'plus';
    countAnimePlus = anime.timeline();    

    $('.next').text(count).css('transform', 'translateY(-100px) translateX(-50%)');

    countAnimePlus.add({ 
        targets: '.active', 
        translateY: 100, 
        translateX: '-50%',
        duration: dur,   
    })
    .add({
        targets: '.next',
        translateY: 0,
        translateX: '-50%',
        duration: dur,
        offset: '-=' + dur,
    });
}

function minus() {
    direction = 'minus';
    countAnimeMinus = anime.timeline();

    $('.next').text(count).css('transform', 'translateY(100px) translateX(-50%)');
    console.log(count)

    countAnimeMinus.add({
        targets: '.active',
        translateY: -100,
        translateX: '-50%',
        duration: dur,
    })
    .add({
        targets: '.next',
        translateY: 0,
        translateX: '-50%',
        duration: 1500,
        offset: '-=' + dur,
    });
}

center();
plus();

setTimeout(() => {
    $('.hide').removeClass('hide');
}, 300);

let socket = io();

let btext;

$(document).ready(()=>{
	startbutton();
});

socket.on('count', function (data) {
  if(ctstate = "started"){
    $("#countvalue").text(data);
    stopbutton();
   }
});


function startbutton(){
  btext = "Start Stirrer";
  $("#stirbutton").text(btext);
  $("#stirbutton").removeClass("btn-danger");
  $("#stirbutton").addClass("btn-primary");
  $("#stirbutton").attr("onclick","toggle('start')");
  $("#countvalue").text("0");
}

function stopbutton(){
  btext = "Stop Stirrer";
  $("#stirbutton").text(btext);
  $("#stirbutton").removeClass("btn-primary");
  $("#stirbutton").addClass("btn-danger");
  $("#stirbutton").attr("onclick","toggle('stop')");
}

let cstate;
function toggle(state){
  $.post("/button",{state}).then((err,res)=>{
    
	if(res){
	   window.location.reload();
	}

  });
}

function logout(){
  window.location.href="/";
}

function modal(txt){
  $("#txtr").text(txt);
  $(".simplemodal").modal('show');
}