var canvas;
var ctx;
var fileReader = new FileReader();
var unstructured_data;
var structured_data_tags = [];
var structured_data_values = [];
var variable_values = [];
var number_of_variables;
var title;

function draw(){
    draw_logo();
}

// Logo
function draw_logo(){
    canvas = document.getElementById('logo');

    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
    }

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(175, 25);
    ctx.lineTo(75, 125);
    ctx.lineTo(225, 150);
    ctx.fill();
    ctx.stroke();
}

function dropHandler(event){
    event.preventDefault();

    var allFiles = event.dataTransfer.files;

    if(allFiles.length != 1){
        alert("You must drop just one file");
        return;
    }

    var file = allFiles[0];

    fileReader.onload = function() {
        unstructured_data = fileReader.result;
        structure_data();
    }

    fileReader.readAsText(file, "UTF-8");
}

function dragoverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function structure_data() {
    var unstructured_data_by_endline = unstructured_data.split("\n");
    unstructured_data_by_endline.shift();
    number_of_variables = (unstructured_data_by_endline[0].split(";").length/2 - 1);
    var unstructured_data_split_by_semicolon = [];

    for(var i = 0; i < unstructured_data_by_endline.length; i++){
        unstructured_data_split_by_semicolon = unstructured_data_by_endline[i].split(";");

        if(i = 0){
            for(var j = 1; i < number_of_variables*2; j += 2)
                variable_values[i] = unstructured_data_split_by_semicolon;
        } 
            
        structured_data_tags[i] = unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-2];
        structured_data_values[i] = unstructured_data_split_by_semicolon[unstructured_data_split_by_semicolon.length-1];
    }
}
  