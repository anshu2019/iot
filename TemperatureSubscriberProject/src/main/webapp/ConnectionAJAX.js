// Sets the hostname and port
var loc = {'hostname': 'localhost', 'port': '8000'};

// Creates a client instance with a unique ID
client = new Paho.MQTT.Client(loc.hostname, Number(loc.port), 'tempSubscriber');

// sets callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connects the client
client.connect({onSuccess: onConnect});

// called afer the the client sucessfuly connects
function onConnect() {
    console.log("connection established, subscribing to pittsburgh/temperatures/");
    //once connection is established, subscribe to the the topic.
    //By default, we will subscribe to all the temperatures....
    client.subscribe("pittsburgh/temperatures/#", {qos: 1});
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        //print the error
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

//This function is called on combo box selection on UI
function setChoice() {
    var combo = document.getElementById("weather");
    //read text of combo box on UI
    var tmpTxt = combo.options[combo.selectedIndex].text;
    //update info on UI ..
    var info = document.getElementById("info");
    //update the status to user
    info.innerHTML = "Waiting for reading on " + tmpTxt + " from MQTT broker";
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    //parse the json......
    var json = JSON.parse(message.payloadString);
    //var messageLine = document.getElementById('msg');

    //extract the temprature and timestamp......
    var temp = json.Temperature + " Farenhite";
    var tmstp = json.Timestamp;
    //extract topic
    var topic = message.destinationName;

    //read the selected choice on UI
    var combo = document.getElementById("weather");
    var tmpReq = combo.value;
    var tmpTxt = combo.options[combo.selectedIndex].text;
    console.log("Selected wetaher by USER :- " + tmpReq);

    //update info on UI ..User will be updated on types of data he/she is waiting for
    var info = document.getElementById("info");
    info.innerHTML = "Waiting for reading on " + tmpTxt + " from MQTT broker";

   //check for hot weather
    if (tmpReq === topic && topic === "pittsburgh/temperatures/hotTemps") {
        //update temeperature and timestammp data
        document.getElementById("msg1").innerHTML = temp;
        document.getElementById("msg11").innerHTML = tmstp;
        document.getElementById("msg1").style.color = "lime";
        document.getElementById("msg2").style.color = "white";
        document.getElementById("msg3").style.color = "white";
        document.getElementById("msg4").style.color = "white";
        //update status to user
        info.innerHTML = "Last received temperature was  " + tmpTxt + "..";
    }
    //check for cold  weather
    else if (tmpReq === topic && topic === "pittsburgh/temperatures/coldTemps") {
        //update temeperature and timestammp data
        document.getElementById("msg2").innerHTML = temp;
        document.getElementById("msg22").innerHTML = tmstp;
        document.getElementById("msg2").style.color = "lime";
        document.getElementById("msg3").style.color = "white";
        document.getElementById("msg1").style.color = "white";
        document.getElementById("msg4").style.color = "white";
        //update status to user
        info.innerHTML = "Last received temperature was  " + tmpTxt + "..";
    }
    //check for nice weather
    else if (tmpReq === topic && topic === "pittsburgh/temperatures/niceTemps") {
        //update temeperature and timestammp data
        document.getElementById("msg3").innerHTML = temp;
        document.getElementById("msg33").innerHTML = tmstp;
        document.getElementById("msg3").style.color = "lime";
        document.getElementById("msg1").style.color = "white";
        document.getElementById("msg2").style.color = "white";
        document.getElementById("msg4").style.color = "white";
        //update status to user
        info.innerHTML = "Last received temperature was  " + tmpTxt + "..";
    }
    ////check for all weather
    else if (tmpReq === "all") {
        //update temeperature and timestammp data
        document.getElementById("msg4").innerHTML = temp;
        document.getElementById("msg44").innerHTML = tmstp;
        document.getElementById("msg4").style.color = "lime";
        document.getElementById("msg1").style.color = "white";
        document.getElementById("msg2").style.color = "white";
        document.getElementById("msg3").style.color = "white";
        //update status to user
        info.innerHTML = "Last received temperature was  " + tmpTxt + "..";
    }
    //info.innerHTML = "Waiting for reading on " + tmpTxt + " from MQTT broker";
    //messageLine.append(newmsg);
}