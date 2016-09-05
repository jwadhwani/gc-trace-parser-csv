"use strict";

var s = [];

//stores 1,000,000 in a local variable
function aString(){
    var text = '';

    //empty out the array when it contains 100, 1,000,000 size char strings
    if(s.length === 100){
        s = [];//this should signal a gc
    }

    //1,000,000 chars added
    for(var i = 0; i < 10000; i++){

        //string of 100 characters
        text += 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ';
    }
    s.push(text);

}

//loop pushing strings of 1,000,000 bytes each time
for(var i = 0; i < 50000; i++ ){
    aString();
}
