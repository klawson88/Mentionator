# About

Mentionator is a jQuery plug-in which enables clients to create highlighted references to (herein reffered to as "mentions" of) predefined entities in text areas. It builds upon the functionality of the jQuery UI autocomplete widget, utilizing the widget to provide its "mention-creation" interface.

The data composed by the plug-in can be used in various ways, most expectedly to help enhance the display of text it is used to help create (by facilitating the placement of "mention" text into inline interactive elements, for example).

On the surface, Mentionator is easy to use, customizable, and requires no changes to existing markup.

Under the hood, Mentionator is well structured, easy to follow, and copiously commented for the benefit of developers seeking to understand how the plug-in works, as well as developers seeking to add homogenous, functinoality-extending code with ease. It has also been fully tested for correct functionality and performance.

# How to use

    //Affix a Mentionator instance to the text area with the id "myTextArea"
    $("#myTextArea").mentionator(mentionatorOptionsObj, autocompleteOptionsObj);
    
    //Get an array, which for each mention, in their order of appearance in the text area with the id
    //"myTextArea", contains an object consisting of the positional and value data of the mention 
    var mentionDataObjArray = $("#myTextArea").mentionator("data")
    
    //Each element of mentionDataObjArray is of the following form (with the appropriate values for each of its properties, of course)
    var mentionDataObj = {
        
        start: null,               //The index in the text of "myTextArea" at which the 
                                   //current superficial value of the mention starts
        
        onePastEnd: null,          //The index in the text of "myTextArea" after that which 
                                   //the current superficial value of the mention ends
        
        substantiveValue: null,    //The external value of the mention, which is the value of the "value" property of
                                   //the object that represented the autocomplete list item used to create the mention
        
        superficialValueArray: []  //If mentionatorOptionsObj.doesRecognizeSubstrings === false: An array consisting of
                                   //the external value of the mention, herein called "initialMentionExternalValue",
                                   //which is the value of the "label" property of the object that represented the
                                   //autocomplete list item used to create the mention
                                   //
                                   //If mentionatorOptionsObj.doesRecognizeSubstrings === true: An array which contains
                                   //as its first element, the current external value of the mention, 
                                   //herein reffered to as "currentExternalMentionValue", which is either
                                   //initialMentionExternalValue, or one of the elements in
                                   //currentExternalMentionValue.split(mentionatorOptionsObj.delimValue).
    };
    
# Options
Given that each Mentionator makes use of a jQuery UI autocomplete widget, two sets of options can be used to configure a Mentionator; those defined by the widget (documented [here](https://api.jqueryui.com/autocomplete/), but see note in the following code section), and those defined by the Mentionator plug-in itself:


    /*
        IMPORTANT
        Mentionator defines a third parameter for autocomplete data source functions, mentionSubstantiveValueToCountObj.
        This parameter is an object in which the internal values of mentions that appear in a given text area, 
        respectively key the number of times said mentions appear in the text area. This can be used to implement
        restrictions on the apperances of mentions in a text area.
    */
    
    var mentionatorOptionsObj = {
        
        triggerGlyph: "@",                          //The glyph used to start the mention-creation process
        
        doesRecognizeDelimitedSubstrings: false,    //A boolean which, if defined as true, will allow the external value
                                                    //of a mention, herein called "mentionExternalValue", to sustain
                                                    //modifications so long as the result of each such modification 
                                                    //is in mentionExternalValue.split(delimValue)
        
        delimValue: null                           //A string, or regular expression representing the set of strings,
                                                   //that, given doesRecognizeDelimitedSubstrings === true, delimit
                                                   //mentionExternalValue substrings that can also serve as external
                                                   //value of the mention if yielded by a modification of
                                                   //mentionExternalValue
    };
    
# Demo
A live demo of Mentionator can be found [here](https://jsfiddle.net/nepcwuc5/1/).
    
# Licensing and usage information

Mentionator is licensed under the MIT License.

Informally, It'd be great to be notified of any derivatives or forks (or even better, issues or refactoring points that may inspire one)!

More informally, it'd really be great to be notified any uses in open-source, educational, or (if granted a license) commercial contexts. Help me build my portfolio, if you found the library helpful it only takes an e-mail!
