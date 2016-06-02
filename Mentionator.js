(function($){
    
    $.fn.mentionator = function(){

            var argCount = arguments.length;
            var invokedFunc;

            if(argCount == 2 && (arguments[0] instanceof Object) && (arguments[1] instanceof Object))
                    invokedFunc = create;
            else if(argCount == 1 && arguments[0] === "data")
                    invokedFunc = getMentionData;

            return invokedFunc.apply(this, arguments);

            function create(mentionatorArgOptionsObj, autocompleteArgOptionsObj)
            {
                    var mentionatorOptionsObj = {triggerGlyph: "@", triggerStrMinLength: undefined, doesRecognizeDelimitedSubTerms: false, delimValue: null};
                    $.extend(true, mentionatorOptionsObj, (mentionatorArgOptionsObj || {}));

                    //Procure a boolean which denotes whether an onpaste handler for textarea elements is defined by the browser,
                    //the boolean will dictate how the functionality defined by the plug-in is to be implemented. The procurement 
                    //technique is detailed at http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
                    var isTextAreaOnPasteSupported = (function(){

                            var isSupported = true;

                            var dummyTextArea = document.createElement("textarea");

                            if(!("onpaste" in dummyTextArea)) 
                            {
                              dummyTextArea.setAttribute("onpaste", 'return;');
                              isSupported = (dummyTextArea[eventName] instanceof Function);
                            }

                            dummyTextArea = null;
                            return isSupported;
                    })();

                    return this.each(function(){

                            var mentionSubstantiveValueToCountObj = {};
                            var mentionDataObjArray = [];

                            var $textAreaObj = 
                                    $(this)
                                            .data("mentionator.mentionSubstantiveValueToCountObj", mentionSubstantiveValueToCountObj)
                                            .data("mentionator.mentionDataObjArray", mentionDataObjArray);

                            var $textAreaShadowParagraphObj = createTextAreaShadowParagraph();

                            $textAreaObj
                                    .autocomplete(procureMentionatorAutocompleteOptionsObj())
                                    .scroll(refreshShadowParagraphViewportPosition)
                                    .mouseup(refreshShadowParagraphDimensions);

                            mentionatorOptionsObj.triggerStrMinLength = $textAreaObj.autocomplete("option", "minLength");

                            if(isTextAreaOnPasteSupported)
                                    $textAreaObj.on("keypress keyup paste", function(event){performTextAreaValueChangeBasedRefresh()});
                            else
                                    $textAreaObj.data("mentionator.internalMentionDataRefreshIntervalFuncId", setInterval(function(){performTextAreaValueChangeBasedRefresh()}, 100));

                            /**
                             * Places an inconspicuous paragraph (the text of which is to be equally inconspicuous)
                             * under the textarea which has dimensions identical to those of the textarea.

                             * @return		a jQuery object representing the paragraph which this function placed under the
                             *				textarea and styled in a way that makes it equal in dimension to the textarea and 
                             *				gives it, and the text it is to contain, an inconspicuous appearance
                             */
                            function createTextAreaShadowParagraph()
                            {
                                    var textAreaPositionDataObj = $textAreaObj.position();

                                    var textAreaZIndexValue = $textAreaObj.css("z-index");
                                    var textAreaShadowZIndexValue = (textAreaZIndexValue instanceof Number ? textAreaZIndexValue - 1 : -1);

                                    var shadowParagraphStyleDataObj = {
                                            "position": "absolute",
                                            "display": $textAreaObj.css("display"),

                                            "left": textAreaPositionDataObj.left + "px",
                                            "top": textAreaPositionDataObj.top + "px",
                                            "z-index": textAreaShadowZIndexValue,

                                            "width": $textAreaObj.css("width"),
                                            "min-width": $textAreaObj.css("min-width"),
                                            "max-width": $textAreaObj.css("max-width"),

                                            "height": $textAreaObj.css("height"),
                                            "min-height": $textAreaObj.css("min-height"),
                                            "max-height": $textAreaObj.css("max-height"),

                                            "resize" : $textAreaObj.css("resize"),

                                            "overflow": $textAreaObj.css("overflow"),

                                            "padding-top": $textAreaObj.css("padding-top"),
                                            "padding-bottom": $textAreaObj.css("padding-bottom"),
                                            "padding-right": $textAreaObj.css("padding-right"),
                                            "padding-left": $textAreaObj.css("padding-left"),

                                            "border-style": $textAreaObj.css("border-style"),
                                            "border-top-width": $textAreaObj.css("border-top-width"),
                                            "border-right-width": $textAreaObj.css("border-right-width"),
                                            "border-bottom-width": $textAreaObj.css("border-bottom-width"),
                                            "border-left-width": $textAreaObj.css("border-left-width"),
                                            "border-color": "transparent",

                                            "-moz-border-top-left-radius" : $textAreaObj.css("-moz-border-top-left-radius"),
                                            "-moz-border-top-right-radius" : $textAreaObj.css("-moz-border-top-right-radius"),
                                            "-moz-border-bottom-right-radius" : $textAreaObj.css("-moz-border-bottom-right-radius"),
                                            "-moz-border-bottom-left-radius" : $textAreaObj.css("-moz-border-bottom-left-radius"),

                                            "-webkit-border-top-left-radius" : $textAreaObj.css("-webkit-border-top-left-radius"),
                                            "-webkit-border-top-right-radius" : $textAreaObj.css("-webkit-border-top-right-radius"),
                                            "-webkit-border-bottom-right-radius" : $textAreaObj.css("-webkit-border-bottom-right-radius"),
                                            "-webkit-border-bottom-left-radius" : $textAreaObj.css("-webkit-border-bottom-left-radius"),

                                            "border-top-left-radius" : $textAreaObj.css("border-top-left-radius"),
                                            "border-top-right-radius" : $textAreaObj.css("border-top-right-radius"),
                                            "border-bottom-right-radius" : $textAreaObj.css("border-bottom-right-radius"),
                                            "border-bottom-left-radius" : $textAreaObj.css("border-bottom-left-radius"),

                                            "outline-width": $textAreaObj.css("outline-width"),
                                            "outline-style": $textAreaObj.css("outline-style"),
                                            "outline-color": "transparent",

                                            "margin-top": $textAreaObj.css("margin-top"),
                                            "margin-bottom": $textAreaObj.css("margin-bottom"),
                                            "margin-right": $textAreaObj.css("margin-right"),
                                            "margin-left": $textAreaObj.css("margin-left"),

                                            "background-image": $textAreaObj.css("background-image"),
                                            "background-position": $textAreaObj.css("background-position"),
                                            "background-size": $textAreaObj.css("background-size"),
                                            "background-repeat": $textAreaObj.css("background-repeat"),
                                            "background-origin": $textAreaObj.css("background-origin"),
                                            "background-clip": $textAreaObj.css("background-clip"),
                                            "background-attachment": $textAreaObj.css("background-attachment"),
                                            "background-color": $textAreaObj.css("background-color"),

                                            "white-space": $textAreaObj.css("white-space"),
                                            "word-wrap": $textAreaObj.css("word-wrap"),

                                            "font-style": $textAreaObj.css("font-style"),
                                            "font-variant": $textAreaObj.css("font-variant"),
                                            "font-weight": $textAreaObj.css("font-weight"),
                                            "font-stretch": $textAreaObj.css("font-stretch"),
                                            "font-size": $textAreaObj.css("font-size"),
                                            "line-height": $textAreaObj.css("line-height"),
                                            "font-family": $textAreaObj.css("font-family"),

                                            "color": "rgba(0, 0, 0, 0.0)"
                                    };


                                    /**
                                     * Creates a string which contains the style data in {@code shadowParagraphStyleDataObj}
                                     * in a format that makes it suitable for use as the value of an HTML style attribute.

                                     * @return  a String consisting of one or more CSS declarations, each of which is
                                     *			made up of a property-value pair in {@code shadowParagraphStyleDataObj} 
                                     */
                                    function createShadowParagraphStyleAttributeValue()
                                    {
                                            var valueStr = "";

                                            for(var key in shadowParagraphStyleDataObj)
                                                    valueStr += key + ":" + shadowParagraphStyleDataObj[key] + ";";

                                            return valueStr;
                                    }

                                    var shadowParagraphHTMLText = "<p style='" + createShadowParagraphStyleAttributeValue() + "'></p>";

                                    return $textAreaObj.css("background", "transparent").before(shadowParagraphHTMLText).prev();
                            }



                            /**
                             * Creates an array of the possible superficial values of a "mention", which 
                             * are strings capable of visually representing the "mention" in the textarea.

                             * @param mentionSuperficialValue	the String which represents a "mention" in the textarea
                             * @return							an array consisting consisting of {@code mentionSuperficialValue} and the substrings in it that are delimited
                                                                                                    by {@code mentionatorOptionsObj.delimeterValue} if the Mentionator was defined to be capable of recognizing 
                                                                                                    superficial value sub-strings (mentionatorOptionObj.doesRecognizeDelimitedSubTerms === true), or an array 
                                                                                                    consisting of a single element, {@code mentionSuperficialValue}, if the Mentionator was not defined in such a way
                             */
                            function procureMentionSuperficialValueArray(mentionSuperficialValue)
                            {
                                    var superficialValueArray;

                                    if(mentionatorOptionsObj.doesRecognizeDelimitedSubTerms)
                                    {
                                            superficialValueArray = String(mentionSuperficialValue).split(mentionatorOptionsObj.delimValue);

                                            //If mentionSuperficialValue was split (split() yields an array with a single element, the string which invoked the method, only if said string
                                            //cannot be split), we'll prepend it to superficialValueArray. Given that a "mention" is not expected to be modified after it is created, and
                                            //that the values in the to-be-returned array (superficialValueArray) are to sequentially serve as the subjects of a search of the textarea
                                            //for a superficial value of the "mention" this function was invoked for (in order to determine if the "mention" can be considered existent),
                                            //mentionSuperficialValue, the current superficial value of the "mention", is prepended to the array in order to optimize the search 
                                            if(superficialValueArray.length != 1)                    	
                                                    superficialValueArray.unshift(mentionSuperficialValue);            	
                                    }
                                    else
                                            superficialValueArray = [mentionSuperficialValue];

                                    return superficialValueArray;
                            }


                            /**
                             * Inserts, at the position corresponding to that which the "mention" it represents has relative 
                             * to other "mentions" in the textarea, an object containing the positioning and value data of
                             * a "mention" into {@code mentionDataObjArray} , and initializes or increments the tally in 
                             * {@code mentionSuperficialValueToCountObj} that is to be keyed, or already keyed, by the 
                             * substantive value of the mention.

                             * @param newMentionDataObj     	an object containing the location and value data of a "mention"
                             */
                            function registerMention(newMentionDataObj)
                            {
                                    var i = 0;

                                    for(i; i < mentionDataObjArray.length; i++)
                                    {
                                            if(newMentionDataObj.start <= mentionDataObjArray[i].start)    	//If these are equal, the new "mention" starts at this location, pushing the "mention" already 
                                            {																	//in the array back, so we insert the former in to the array immediately before the latter 	
                                                    mentionDataObjArray.splice(i, 0, newMentionDataObj);       		
                                                    break;
                                            }
                                    }

                                    if(i == mentionDataObjArray.length)
                                            mentionDataObjArray.push(newMentionDataObj);

                                    var newMentionSubstantiveValue = newMentionDataObj.substantiveValue;

                                    if(mentionSubstantiveValueToCountObj.hasOwnProperty(newMentionSubstantiveValue))
                                            mentionSubstantiveValueToCountObj[newMentionSubstantiveValue]++;
                                    else
                                            mentionSubstantiveValueToCountObj[newMentionSubstantiveValue] = 1;
                            }

                            /**
                             * Removes the object containing the data of a "mention" from {@code mentionDataObjArray}
                             * and removes or decrements the tally in {@code mentionSuperficialValueToCountObj}
                             * keyed by the superficial value of the "mention".

                             * @param targetMentionDataObjIndex		an int denoting the index in {@code mentionDataObjArray} at which the object
                             * 										which contains the data of the to-be-deregistered "mention" is located 
                             */
                            function deregisterMention(targetMentionDataObjIndex)
                            {
                                    var substantiveValue = mentionDataObjArray[targetMentionDataObjIndex].substantiveValue;

                                    if(mentionSubstantiveValueToCountObj[substantiveValue] > 1)
                                             mentionSubstantiveValueToCountObj[substantiveValue] - 1;
                                    else
                                            delete mentionSubstantiveValueToCountObj[substantiveValue];

                                    mentionDataObjArray.splice(targetMentionDataObjIndex, 1);
                            }



                            /**
                             * Procures the object that is to be used as the argument for the jQuery UI autocomplete
                             * widget that the Mentionator is to provide its "mention"-creating functionality through;
                             * the callbacks defined in the object that are pertinent to "mention" creation collectively
                             * and transparently execute the logic which implements the functionality.

                             * @return		an object containing initializng configuration data for a jQuery UI autocomplete widget;
                             *				the callbacks defined in the object that are pertinent to "mention" creation collectively
                             * 				and transparently execute the logic which implements the functionality
                             */
                            function procureMentionatorAutocompleteOptionsObj()
                            {
                                    /**
                                     * Gets the locations of the beginning and end of a selection of text in an HTML element.
                                     * (This is a method supplied by Tim Down at http://stackoverflow.com/a/3373056/468737.)

                                     * @param el     a DOM element object
                                     * @return       an object containing the start and end positions of the selection
                                     */
                                    function getInputSelection(el) {
                                            var start = 0, end = 0, normalizedValue, range,textInputRange, len, endRange;

                                            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                                                    start = el.selectionStart;
                                                    end = el.selectionEnd;
                                            } else {
                                                    range = document.selection.createRange();

                                                    if (range && range.parentElement() == el) {
                                                            len = el.value.length;
                                                            normalizedValue = el.value.replace(/\r\n/g, "\n");

                                                            // Create a working TextRange that lives only in the input
                                                            textInputRange = el.createTextRange();
                                                            textInputRange.moveToBookmark(range.getBookmark());

                                                            // Check if the start and end of the selection are at the very end
                                                            // of the input, since moveStart/moveEnd doesn't return what we want
                                                            // in those cases
                                                            endRange = el.createTextRange();
                                                            endRange.collapse(false);

                                                            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                                                                    start = end = len;
                                                            } else {
                                                                    start = -textInputRange.moveStart("character", -len);
                                                                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                                                                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                                                            end = len;
                                                                    } else {
                                                                            end = -textInputRange.moveEnd("character", -len);
                                                                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                                                                    }
                                                            }
                                                    }
                                            }

                                            return {
                                                    start: start,
                                                    end: end
                                            };
                                    }

                                    /**
                                     * Finds the last trigger glyph that appears before the current cursor location in a textarea or textfield.

                                     * @param currentText           a String of the text in a textarea or textfield
                                     * @param cursorLocation        an int representing the current location of the cursor in the element containing {@code currentText}
                                     * @return                      an int representing the location of the last trigger glyph before {@code cursorLocation}
                                     */
                                    function findNearestTriggerGlyphBeforeCursor(currentText, cursorLocation)
                                    {
                                             var textAreaTextUpToCursor =  currentText.substring(0, cursorLocation);
                                             return  textAreaTextUpToCursor.lastIndexOf(mentionatorOptionsObj.triggerGlyph);
                                    }



                                    /**
                                     * Retrieves the text between the last trigger glyph appearing 
                                     * before the cursor (in a textarea or textfield), and the cursor.

                                     * @param textArea          a textarea DOM object
                                     * @param currentText       a String of the text in {@code textArea}
                                     * @return                  a String of the text between the last trigger glyph before the cursor and the cursor,
                                     *                          or the empty string if there is no trigger glyph before the cursor
                                     */
                                    function  getTextFromNearestTriggerGlyphBeforeCursorToCursor(textArea, currentText)
                                    {
                                            var cursorLocation  = getInputSelection(textArea).start;
                                            var nearestTriggerGlyphBeforeCursorLocation =  findNearestTriggerGlyphBeforeCursor(currentText, cursorLocation);

                                            if(nearestTriggerGlyphBeforeCursorLocation == -1)
                                                    return "";
                                            else
                                                    return currentText.substring(nearestTriggerGlyphBeforeCursorLocation + 1, cursorLocation);
                                    }


                                    /**
                                     * Sets the position of a cursor in an html element. (This is a modified version of a 
                                     * method supplied by Tim Down at http://stackoverflow.com/a/499158/468737.)

                                     * @param el     a DOM element object
                                     */
                                    function setCursorPosition(el, desiredPosition) {
                                              if (el.setSelectionRange) {
                                                    el.focus();
                                                    el.setSelectionRange(desiredPosition, desiredPosition);
                                              }
                                              else if (el.createTextRange) {
                                                    var range = el.createTextRange();
                                                    range.collapse(true);
                                                    range.moveToPoint(desiredPosition);
                                                    range.select();
                                              }
                                    }



                                    /**
                                     * Creates a "mention" using data which describes an item in the menu of a jQuery UI autocomplete widget.
                                     * This function is intended to be defined as a handler of the "select" event of the autocomplete widget
                                     * which the Mentionator instance creates.

                                     * @param event		the object which represents the event (the selection of an item in the menu of 
                                     *					a jQuery UI autocomplete widget) that is to spur the execution of this function
                                     * @param ui		an object provided by the jQuery UI autocomplete widget which {@code event} is tied
                                     *					to, that consists of an object with label and value properties of the menu item that
                                     *					is the subject of the selection event which {@code event} represents
                                     * @return			false to prevent the autocomplete widget which this function serves as a 
                                     *					"select" event handler of from firing the default handler of the event 
                                     */
                                    function onSelect(event, ui)
                                    {
                                            var currentText = $textAreaObj.val();
                                            var cursorLocation = getInputSelection($textAreaObj[0]).start;
                                            var locationOfNearestTriggerGlyphBeforeCursor = findNearestTriggerGlyphBeforeCursor(currentText, cursorLocation);

                                            var textAreaTextBeforeNearestTriggerGlyphBeforeCursor = currentText.substring(0, locationOfNearestTriggerGlyphBeforeCursor);
                                            var textAreaTextAfterCursorLocation = currentText.substring(cursorLocation);

                                            var selectedItemLabel = ui.item.label;

                                            $textAreaObj.val(textAreaTextBeforeNearestTriggerGlyphBeforeCursor + selectedItemLabel + textAreaTextAfterCursorLocation);

                                            var locationOfBeginningOfSelectedItem = $textAreaObj.val().indexOf(selectedItemLabel, locationOfNearestTriggerGlyphBeforeCursor);  //Calculates item location in this manner to account for newlines
                                            var locationOfOnePastEndOfSelectedItem = locationOfBeginningOfSelectedItem + selectedItemLabel.length;

                                            var superficialValueArray = procureMentionSuperficialValueArray(selectedItemLabel);

                                            //These objects are generated for each "mention" and stored in mentionDataObjArray, which is used to help highlight "mentions" 
                                            //and ensure that each "mention" has a unique subject (the subject of a "mention" is defined as the substantiveValue property 
                                            //of its mentionDataObj) If (mentionatorOptionsObj.doesRecognizeDelimitedSubterms === true), each of these objects also allows its 
                                            //corresponding "mention" to persist despite modifications made to the superficial value of the "mention", provided said modifications
                                            // each yield a value in superficialValueArray (which will, in turn, be repopulated accordingly upon each such modification)
                                            var mentionDataObj = {start: locationOfBeginningOfSelectedItem, onePastEnd: locationOfOnePastEndOfSelectedItem, substantiveValue: ui.item.value, superficialValueArray: superficialValueArray};

                                            registerMention(mentionDataObj);
                                            refreshInternalMentionData();

                                            setCursorPosition($textAreaObj[0], locationOfOnePastEndOfSelectedItem)

                                            return false;                 //Prevents the default behavior from taking place after the function is exited (we take care of the select functionality entirely in the above code)
                                    }

                                    var mentionatorAutocompleteOptionsObj = {};
                                    $.extend(true, mentionatorAutocompleteOptionsObj, (autocompleteArgOptionsObj || {}));

                                    if(mentionatorAutocompleteOptionsObj.source instanceof Function)
                                    {
                                            var originalSourceFunc = mentionatorAutocompleteOptionsObj.source;

                                            mentionatorAutocompleteOptionsObj.source = function(request, response){

                                                    var actualRequestTerm = getTextFromNearestTriggerGlyphBeforeCursorToCursor($textAreaObj[0], request.term);

                                                    if(actualRequestTerm.length >= mentionatorOptionsObj.triggerStrMinLength)
                                                    {
                                                            var actualRequest = {term: actualRequestTerm};
                                                            originalSourceFunc(actualRequest, response, mentionSubstantiveValueToCountObj);
                                                    }
                                                    else
                                                            response([]);
                                            }
                                    }

                                    var originalFocusFunc = mentionatorAutocompleteOptionsObj.focus;

                                    mentionatorAutocompleteOptionsObj.focus = function(event, ui){
                                            var canInvokeDefaultOnFocus = false; 

                                            if(!!originalFocusFunc) 
                                                    canInvokeDefaultOnFocus = originalFocusFunc(event, ui); 

                                            return canInvokeDefaultOnFocus;
                                    };

                                    var originalSelectFunc = mentionatorAutocompleteOptionsObj.select;

                                    mentionatorAutocompleteOptionsObj.select = function(event, ui){
                                            var canInvokeDefaultOnSelect = true; 

                                            canInvokeDefaultOnSelect = onSelect(event, ui);  

                                            if(!!originalSelectFunc)
                                                    canInvokeDefaultOnSelect = originalSelectFunc(event, ui); 

                                            return canInvokeDefaultOnSelect;
                                    };

                                    return mentionatorAutocompleteOptionsObj;
                            }


                            /**
                             * Adjusts the position of the shadow paragraph viewport to match that of the textarea viewport, if necessary.
                             */
                            function refreshShadowParagraphViewportPosition(event)
                            {
                                    var textAreaScrollLeft = $textAreaObj.scrollLeft();
                                    var textAreaScrollTop = $textAreaObj.scrollTop();

                                    if($textAreaShadowParagraphObj.scrollLeft() != textAreaScrollLeft)
                                            $textAreaShadowParagraphObj.scrollLeft(textAreaScrollLeft)

                                    if($textAreaShadowParagraphObj.scrollTop() != textAreaScrollTop)
                                            $textAreaShadowParagraphObj.scrollTop(textAreaScrollTop)
                            }


                            /**
                             * Adjusts the position of the dimensions of the shadow paragraph to match those of the textarea, if necessary.
                             */
                            function refreshShadowParagraphDimensions()
                            {
                                    var textAreaWidth = $textAreaObj.width();
                                    var textAreaHeight = $textAreaObj.height();

                                    if($textAreaShadowParagraphObj.width() != textAreaWidth)
                                            $textAreaShadowParagraphObj.width(textAreaWidth)

                                    if($textAreaShadowParagraphObj.height() != textAreaHeight)
                                            $textAreaShadowParagraphObj.height(textAreaHeight)
                            }

                            /**
                             * Updates the data of the elements in {@code mentionDataArray} that correspond to mentions that have been
                             * superficially modified or moved, and deregisters "mentions" that have been superficially removed.
                             *
                             * While {@code mentionDataArray} is sequentially scanned for objects containing the data of "mentions" that
                             * have been superficially modified, moved, or removed, an html version of the textarea text is built with HTML spans surrounding
                             * each string that is the superficial value of a "mention". This version of the text is then inserted in to the shadow
                             * paragraph of the textarea, which is an inconspicuous paragraph under the textarea withdimensions identical to those 
                             * of the textarea; the result is the illusion of the "mentions" in the textarea being highlighted.
                             */
                            function refreshInternalMentionData()
                            {
                                    var textAreaValue = $textAreaObj.val();

                                    var onePastEndOfLastProcessedMention = 0;
                                    var shadowParagraphHTML = "";

                                    for(var i = 0; i < mentionDataObjArray.length; i++)
                                    {
                                            var superficialValueArray = mentionDataObjArray[i].superficialValueArray;

                                            var j = 0;
                                            var superficialValueArrayLength = superficialValueArray.length;
                                            for(j; j < superficialValueArrayLength; j++)                     //Searches for the first superficial value of the "mention" that appears in the textarea
                                            {
                                                    var indexOfFirstOccurance = textAreaValue.indexOf(superficialValueArray[j], onePastEndOfLastProcessedMention);

                                                    if(indexOfFirstOccurance != -1)
                                                    {
                                                            mentionDataObjArray[i].start = indexOfFirstOccurance;
                                                            mentionDataObjArray[i].onePastEnd = indexOfFirstOccurance + superficialValueArray[j].length;
                                                            mentionDataObjArray[i].superficialValueArray = procureMentionSuperficialValueArray(superficialValueArray[j]);

                                                            var textBetweenLastAndCurrentMentions = textAreaValue.substring(onePastEndOfLastProcessedMention, mentionDataObjArray[i].start);
                                                            shadowParagraphHTML += textBetweenLastAndCurrentMentions + "<span class='mentionSpans'>" + mentionDataObjArray[i].superficialValueArray[0] + "</span>";		//The text contained in each of these spans can, and presumably will, be highlighted 
                                                            onePastEndOfLastProcessedMention = mentionDataObjArray[i].onePastEnd;                                                                              				//in some manner, giving the appearance of such an effect in the textarea

                                                            break;
                                                    }
                                            }

                                            if(j == superficialValueArrayLength)                             //None of the superficial values of the "mention" were found, so we'll remove the "mention"
                                                    deregisterMention(i--);   
                                    }

                                    shadowParagraphHTML += textAreaValue.substring(onePastEndOfLastProcessedMention);

                                    //Set the internal HTML of the shadow paragraph to a version of shadowParagraphHTML in which line breaks are
                                    //implemented using <br /> elements in lieu of \n or \n\r character sequences, appending a <br /> at the end
                                    //of the HTML to ensure the lone trailing <br /> of the HTML, if such a <br /> exists, is rendered. Such a 
                                    //version of shadowParagraphHTML is created because \n and \n\r character sequences, unlike <br /> elements,
                                    //alter the scroll heights of textareas and non-textarea elements differently, breaking the dimensional
                                    //parity which is supposed to exist between the shadow paragraph and textarea)
                                    $textAreaShadowParagraphObj.html(shadowParagraphHTML.replace(/\n\r?/g, "<br />") + "<br />");
                            }


                            /**
                             * Update the facility assets and facility asset properties which can change upon modification of the value of the textarea. 
                             */
                            function performTextAreaValueChangeBasedRefresh()
                            {
                                    refreshInternalMentionData();

                                    //Necessary because a change in the content of a non-input, or non-input-like element does not
                                    //necessarily result in the appropriate change, or a change at all, of its viewport position 
                                    refreshShadowParagraphViewportPosition();		
                            }
                    })
            }

            function getMentionData()
            {
                    return this.data("mentionator.mentionDataObjArray");
            }
    }
	
})(jQuery)