/***
 *	wordSwap jQuery plugin
 *  2012 - Aaron Decker
 * 	me@a-r-d.me
*************************************************************************************
 * Param guide:
 * 'newWord' - if you define a single word: - it will just swap out a word, one time
 * 'wordArray' - if you pass an array, it will use this 
 * 'customChars' - pass in your own array of symbols to loop over
 * 'simpleMode' - if true, only swap letters, no 'Airport effect'
 * 'intervalLetter' -  to swap each letter - 100 is about good for a small array
 * 'charArr' - there are 5 predefined- pick one of them or use 'customChars'
 */
(function( $ ){
	$.fn.wordSwap = function( options ) {  
		
	// Things I need to setup:
	var charArrUpperShort = ['A', 'B', 'C', 'D', 'E', 'F'];
    var charArrLowerShort = ['a', 'b', 'c', 'd', 'e', 'f'];
    var charArrUpperLong = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    var charArrLowerLong = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    var symbArrShort = ['$', '&', '#', '@', '?', '%'];
    
    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'newWord'         : null,
      'wordArray' 		: ['testing', 'another test', 'final test'],
      'simpleMode'  	: false,
      'intervalLetter' 	: 100,
      'intervalWord' 	: 5000,
      'loopOnce'		: false,
      'customChars'		: null,
      'charArr'			: 1 
    }, options);
    
    var wordArray = settings.wordArray;
    var location = this; // some jquery selector...
    // set char array:
    var charArray;
    if(settings.customChars != null && settings.customChars.length > 1) charArray = settings.customChars;
    else if(settings.charArr == 1) charArray = charArrUpperShort;
    else if(settings.charArr == 2) charArray = charArrLowerShort;
    else if(settings.charArr == 3) charArray = charArrUpperLong;
    else if(settings.charArr == 4) charArray = charArrLowerLong;
    else if(settings.charArr == 5) charArray = symbArrShort;
    else charArray = charArrUpperShort;
    
    // If we only want to swap 1 word one time:
    if(settings.newWord != null && settings.newWord.length > 1) {
    	swapWordsMainLogic(location, settings.newWord, settings.intervalLetter, settings.simpleMode, charArray);
    } else {
    	// The main loop for an array:
    	var mainIter = 0;
	  $(location).empty().append(wordArray[mainIter]);
	  var outerLoop = setInterval(function (){
	  	
		  	mainIter++;
		  	if(mainIter == wordArray.length) mainIter = 0;
		  	swapWordsMainLogic(location, wordArray[mainIter], settings.intervalLetter, settings.simpleMode, charArray);
		  	
	  }, settings.intervalWord);
    }
	  
      	
  };// end word swap
})( jQuery );

// Takes array, gives back a string...
function wordSwapArrayToString(arr) {
	var newStr = "";
	for(var i = 0; i < arr.length - 1; i++) newStr += arr[i];
	return newStr;
}

function swapWordsMainLogic(selector, wordNew, interval, simpleMode, charArray) {
        var lenNew = wordNew.length;
		var arrNew = wordNew.split('');
        
		var lenOld = $(selector).text().length;
		var arrOld = $(selector).text().split('');
        
        var workingArray = [];
        var workingArray = arrOld.slice(); // make Independent copy of old array
        // set max length, gather more info. Copy longest array
        var maxLen = 0;
        var minLen = 0;
        var newIsLonger = false;
        if(lenNew >= lenOld) {
            maxLen = lenNew;
            minLen = lenOld;
            newIsLonger = true;
            // if the new one is longer:
            for(var i = lenOld - 1; i < lenNew; i++) {
                workingArray.push("&nbsp;"); // add empty chars onto the end.
                arrOld.push("&nbsp;");
            }
        } else {
            maxLen = lenOld;
            minLen = lenNew;
            // new one is shorter
            for(var i = lenNew - 1; i < lenOld; i++) {
                arrNew.push("&nbsp;");
            }
        }
        // Now we have three arrays of uniform length. 
        
        // First we have an interval loop to go over all the letters in each char array
        var iterOuter = 0;
        var intervalMain = setInterval( function(){
            // break interval if we are past the length of the longest one.
            if(maxLen - 1 == iterOuter) clearInterval(intervalMain);
            
            if(!simpleMode) {
                // next we have an inner inerval loop to swap out over the rotating letters.
                var iterInner = 0;
                var intervalInner = setInterval( function() {
                   
                    workingArray[iterOuter] = charArray[iterInner];
                    $(selector).empty().append(wordSwapArrayToString(workingArray));
                    
                    iterInner++;
                    if(iterInner == charArray.length - 1) {
                        clearInterval(intervalInner);
                    }
                }, interval / maxLen);
                
                // just transfer letters over
                workingArray[iterOuter] = arrNew[iterOuter];
                // add working array
                $(selector).empty().append(wordSwapArrayToString(workingArray));
            } else {
                // just transfer letters over
                workingArray[iterOuter] = arrNew[iterOuter];
                // add working array
                $(selector).empty().append(wordSwapArrayToString(workingArray));
            }
            
            iterOuter++;
        }, interval);
    }