function createCSV()
{
    var csvRows = Math.floor(Math.random() * 101);
    var csvColumns = Math.floor((Math.random() * 11)/2)*2 + 2;
    var csvData = "";
    var contVariable = 1;
    var contValor = 1;

    var aux_variable_data;

    for(var i = 0; i < csvColumns; i++){
        if(i % 2 == 0){
            aux_variable_data = "Variable" + contVariable.toString();
            contVariable++;
        }
        else{
            aux_variable_data = "Valor" + contValor.toString();
            contValor++;
        }
    
        csvData += aux_variable_data + ";";
    }

    csvData += "PERIODO" + ";";
    csvData += "VALOR";
    csvData += "\n";

    var csvPosibleCharacters = "qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑZXCVBNM1234567890<>,;.:-_`^[*+]?'¿¡=()/&%¬€$~·#@ºª!|¨´{ç}";
    var csvPosibleCharactersWithoutSemicolon = "qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑZXCVBNM1234567890<>,.:-_`^[*+]?'¿¡=()/&%¬€$~·#@ºª!|¨´{ç}";
    var elementLength = 0;
    var numberOfDecimals = 0;
    var value = "";
    var indexOfDecimal = 0;

    for(var i = 0; i < csvRows; i++){
        for(var j = 0; j < csvColumns; j++){
            var element = "";
            elementLength = Math.floor(Math.random() * 50) + 1;

            for(var k = 0; k < elementLength; k++)
                element += csvPosibleCharactersWithoutSemicolon.charAt(Math.floor(Math.random()*csvPosibleCharactersWithoutSemicolon.length));
            
            csvData += element + ";";
        }

        csvData += (Math.floor(Math.random()*33) + 1990).toString() + ";";

        numberOfDecimals = Math.floor(Math.random()*11);
        value = (Math.random()*5000).toFixed(numberOfDecimals).toString();
        indexOfDecimal = value.indexOf(".");

        if(indexOfDecimal == -1)
            indexOfDecimal = value.length;

        value = value.replace(".", ",");

        indexOfDecimal = indexOfDecimal - 3;


        while(indexOfDecimal > 0){
            value = value.slice(0, indexOfDecimal) + "." + value.slice(indexOfDecimal, value.length);
            indexOfDecimal = indexOfDecimal - 4;
        }

        csvData += value;
        csvData += "\n";
    }

    var csvFilenameLength = Math.floor(Math.random() * 30) + 1;
    var csvFilename = "";

    for(var i = 0; i < csvFilenameLength; i++)
        csvFilename += csvPosibleCharacters.charAt(Math.floor(Math.random()*csvPosibleCharacters.length));

    csvFilename += ".csv";

    var csvTarget = "_blank";
    var csvHref = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);

    var csv = document.createElement("a");
    csv.download = csvFilename;
    csv.target = csvTarget;
    csv.href = csvHref;

    csv.click();
}

