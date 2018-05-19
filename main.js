var difficulty;
var paper;
var score;
var miss_num;  // number of missed shape
var speed;     // disappear speed
var size;      // shape size
var interval;  // interval for producing shape
var shape_list; // which shapes should be produced
var WIDTH = 800;
var HEIGHT = 600;


setup = function(){
	paper = Raphael("main",WIDTH,HEIGHT);
	$('#start_button').click(start_game);
}

$(document).ready(setup);

start_game = function(){
	// set difficulty
	difficulty = $('#difficulty_input').val();
	if(!(difficulty >=1 && difficulty <= 10)){
		alert('invalid difficulty value!');
		return;
	}
	// set shape list
	var i=0;
	shape_list = new Array();
    $('input:checkbox:checked').each(function(){
		shape_list[i] = $(this).val();
		i++;
	});
	if(shape_list.length == 0){
		alert('you should choose at least one shape');
		return;
	}
	// initialize
	paper.clear();
	score = 0;
	miss_num = 0;
	$('#score').text(score);
	$('#miss').text(miss_num);
	speed = 8000/difficulty;     // more difficult => faster
	size = 150/difficulty;      // more difficult => smaller
	interval = 2000/difficulty; // more difficult => smaller
	// game starts
	setInterval(create_shape, interval);
}

create_shape = function(){
	// shape position is random
	var x = Math.random() * WIDTH;
	var y = Math.random() * HEIGHT;
	// create different shapes with the same probability
	var shape;
	var rand = Math.random() * shape_list.length;
	var index = Math.floor(rand);
	shape = create_specific_shape(shape_list[index],x,y);
	shape.attr("stroke","none");
	// set click function
	shape.node.onclick = click_on;
	// move
	var end_x = Math.random() * WIDTH; // move to this position
	var end_y = Math.random() * HEIGHT;
	if(shape.data('shape') == 'circle'){
		var end = {'cx':end_x,'cy':end_y};
		shape.animate(end,speed,"linear",disappear);
	}else if(shape.data('shape') == 'rectangle' ||
			 shape.data('shape') == 'square'){
		var end = {'x':end_x,'y':end_y};
		shape.animate(end,speed,"linear",disappear);
	}else if(shape.data('shape') == 'triangle' || 
		     shape.data('shape') == 'pentagram' ){
		var end = 't' + (end_x-x) + ' ' + (end_y-y);
		shape.animate({transform: end}, speed,"linear", disappear);
	}
}

// create the specific shape at position(x,y)
create_specific_shape = function(shape_name,x,y){
	var shape;
	if(shape_name == 'circle'){
		shape = create_circle(x,y);
	}else if(shape_name == 'rectangle'){
		shape = create_rectangle(x,y);
	}else if(shape_name == 'square'){
		shape = create_square(x,y);
	}else if(shape_name == 'triangle'){
		shape = create_triangle(x,y);
	}else if(shape_name == 'pentagram'){
		shape = create_pentagram(x,y);
	}
	return shape;
}

// click function
click_on = function(){
	score++;
	$('#score').text(score);
	this.remove();
}

// callback function for disappear
disappear = function(){
	miss_num++;
	$('#miss').text(miss_num);
	this.remove();
}


// create different shape
create_circle = function(x,y){
	var cir = paper.circle(x,y,size/2);
	var r = Math.random()*255;
	var g = Math.random()*255;
	var b = Math.random()*255;

	cir.attr("fill", 'rgb('+r+','+g+','+b+')');
	//cir.attr("fill", 'rgb(255,0,0)');
	cir.data('shape', 'circle');
	return cir;
}
create_rectangle = function(x,y){
	var rect = paper.rect(x,y,size,size*0.618);
	rect.attr("fill", "red");
	rect.data('shape', 'rectangle');
	return rect;
}
create_square = function(x,y){
	var squa = paper.rect(x,y,size,size);
	squa.attr("fill", "blue");
	squa.data('shape', 'square');
	return squa;
}
create_triangle = function(x,y){
	var tri_path = 'M'+x+' '+y+
					'L'+(x+size)+' '+y+
					'L'+(x+size/2)+' '+(y-Math.sqrt(3)/2*size)+
					'M'+x+' '+y;
	var tri = paper.path(tri_path);
	tri.attr("fill", "orange");
	tri.data('shape', 'triangle');
	return tri;
}
create_pentagram = function(x,y){
	var path="";
    for(var i=0;i<10;i+=2){
        path += (i?"L":"M")+(Math.sin(Math.PI*2/5*i)*size/2+x)+","
        		+(Math.cos(Math.PI*2/5*i)*size/2+y)+" ";
    }
    var pen = paper.path(path+"z");
    pen.attr("fill", "green");  
    pen.data('shape', 'pentagram');
    return pen;
}


