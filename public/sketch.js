let socket = io();
let isCheckedArray;

void setup(){
    for(var i=0; i<100; i++) {
        var check = document.createElement("input");
        check.type = "checkbox";
        check.id = i;
        document.body.appendChild(check);
}


}

void loop(){}