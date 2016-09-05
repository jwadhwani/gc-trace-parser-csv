"use strict";

function bString(){
    var s = []; //withing a closure

//stores 1,000,000 in a local variable
    return function aString(){
        var text = '';

        //empty out the array when it contains 400 1,000,000 char strings
        if(s.length === 100){
            s = [];
        }

        //1,000,000 chars added
        for(var i = 0; i < 10000; i++){

            //string of 100 characters
            text += 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ';
        }
        s.push(text);

    }
}


var aStr = bString();

for(var i = 0; i < 50000; i++ ){
    aStr();
}
