
function showWebGL() {
    document.getElementById("WebGL-output").style.display = "block";
}

function showLoadButtom() {
    document.getElementById("show-charts-buttom").style.display = "inline-block";
}

function getCSVData() {
    var bar_canvas = document.getElementById('bar_chart');
    var csvForm = document.getElementById("obtainCSVForm");
    var csvFile = document.getElementById("csvFile");
        
    csvForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var inputFile = this.csvFile.files[0];    
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            aux_string_data = event.target.result;
                var second_quote = false;
                var aux;
                var aux_string_data;
                var aux_data = [];
        
            while(aux_string_data.search('"') > -1) { 
                if(second_quote){
                    aux = aux_string_data.substring(0, aux_string_data.search('"'));
                    aux_data = aux.split('\t');
                    aux_data = aux_data.filter(String);
                    data.push(aux_data);
                    aux_string_data = aux_string_data.substring(aux_string_data.search('"')+3);
                    aux_data = [];
                } else {
                    aux_string_data = aux_string_data.replace('"', '');
                }
        
                second_quote = !second_quote;
            }
        
            data.shift();
        }
        
        this.fileReader.readAsText(this.inputFile);
    });
}