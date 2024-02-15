import App     from "./App.js";
import Triplet from "./Triplet.js";
function parse(numberStr, context, noun, simple, warn) {
    numberStr = numberStr.trim();
    
    let matches = numberStr.match(App.regex);
    
    let sign    = matches[1]
    let number =  matches[2];
    let comma   = matches[4];
    let decimal = matches[6];
    
    let signs      = {"-": "lúide", "+":"moide"};
    let signPrefix = "";
    if (sign) {
        signPrefix = signs[sign] + " ";
    }
    // Get rid of embedded commas.
    if (comma) {
        number = number.replaceAll(",", "");
    }
    
    // Get rid of leading zeros.
    while (number && number.length > 1 && number.startsWith("0")) {
        number = number.substring(1);
    }
    
    if (number.length > 24) {
        return "Error: number too large.  Limit is 10**24.";
    }

    // Make sure to defer writing any noun till
    // after a decimal.  We don't do this if
    // the decimal is not followed by any digits.
    let numberVal = "";
    let nounSuffix = "";
    if (decimal  && decimal.length > 1 && noun) {
        nounSuffix = " "+noun;
        noun = "";
    }
    
    if (number && number.length > 0) {
        numberVal = parseInteger();
    }
    
    let decimalSuffix = "";
    if (decimal) {
        decimalSuffix = parseDecimal();
        if (decimalSuffix) {
            decimalSuffix = " "+decimalSuffix;
        }
    }
    
    let result = signPrefix + numberVal + decimalSuffix + nounSuffix;
    result = result.trim().replace(/\s+/g, ' ');
    return result;
 
    
    
    function parseInteger() {
        let result = "";
    
        // Quick value to see if we exceed minimum values needed for simple formats.
        let n = parseFloat(number);
        if (decimal) {
            context = "counting"; // Only do counting numbers if a decimal is specified.
        }
    
        // Use the simple syntax where possible (not for ordinals) 
        // when the number is larger than the requirement for that form.
        // There are simple systems for counting numbers starting at 10,000
        // and for objects at 20.  There is no simple system for 
        // ordinal numbers (and no personal numbers over 12.
        switch(context) {
            case "counting":
                if (n < 10001) {
                   simple = false;
                }
                break;
            case "ordinal":
                simple = false;
                break;  // never simple
            default:
                if (n < 20) {
                    simple = false;
                }            
        }

        // Handle something like 1003 persons where we send 3 to low order triplet.
        if ((n == 11 || n > 12) && (context == "people")) {
            context = "objects";
        }
    
    
        // Need to do at least one iteration.
        let index = 0;    
        let first = true;  // Have we seen a non-zero triplet yet?
        let singleDigitTriplet = false;
        do {
            let tripVal;
            let highest = number.length < 4;
            // Get triplet value.
            if (number.length < 3) {
                tripVal = parseInt(number);
            } else {
                tripVal = parseInt(number.substring(number.length-3));
            }
            if (number.length < 3 || tripVal) {  // Handle special case of 0
                let trp = new Triplet(tripVal, index, context, noun, warn);
                let trpRes = trp.render(first, simple, highest);
                        
                // Separate by commas if lower order number is two digits or more
                // Use is when previous triplet was less than 20.
                if (!first) {
                    let ins = " ";
                    if (singleDigitTriplet) {
                        if (!result.startsWith("a")) {
                            ins = " is ";
                        }
                    } else {
                        ins = ", ";
                    }
                    result = trpRes + ins + result;
                } else {
                    result = trpRes;
                }
                first  = false;
            }
            
            index += 1;
            if (number.length < 4) {
                break;
            }
            number = number.substring(0, number.length-3);
            if (tripVal < 20  && tripVal > 0) {
                singleDigitTriplet = true;  // Used when tying triplets togeter.            
            }
        
        } while (true);
    
        return result;
    }
    
    function parseDecimal() {
        
        // Copied from triplet.
        let vowels    = {a:1, e:1, i:1, o:1, u:1, á:1, é:1, í: 1, ó:1, ú:1};
 
        let basePrefix = [
            "náid", "aon", "dó",
            "trí", "ceathair", "cúig",
            "sé", "seacht", "ocht",
            "naoi"];
        // Prepend h to words beginning with a vowel.
        function hPrefix(noun) {
            if (noun == null || noun.length == 0) {
                return noun;
            }
            let init = noun.substring(0,1);
            if (vowels[init]) {
                return "h" + noun;
            } else {
                return noun;
            }            
        }
        // End copy.
        
        let result = "";
        let digits = decimal.substring(1);  // Strip the decimal point.
        if (digits.length == 0) {
            return "";            
        } else {
            result = "ponc ";            
        }
        let sep = " ";
        while (digits.length > 0) {
            let digit = digits.substring(0,1);
            let n = parseInt(digit);
            if (n == 0) {
                result += sep + basePrefix[n];
            } else {
                result += sep + "a "+hPrefix(basePrefix[n]);
            }
            digits = digits.substring(1);
        }
        return result;
    }    
}

export default parse;

