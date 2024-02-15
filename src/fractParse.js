import parse from "./parse.js";
function fractParse(sign, num, denom, noun, simple, warn) {
    
    let signs      = {"-": "lúide", "+":"moide"};
    let signPrefix = "";
    if (sign) {
        signPrefix = signs[sign] + " ";
    }
    
    let ratio = true;
    let nd = parseInt(denom);
    
    let fract = "";
    
    if (nd < 20) {
        ratio = false;
    }
    
    if (/^10*$/.test(denom)  && (denom.length < 4 || ((denom.length-1)%3 == 0))) {
        ratio = false;
    }
    
    if (nd < 100 && nd%10==0) {
        ratio = false;
    }
    
    if (nd == 0 || num == "0") {
        ratio = true;
    }
    
    
    if (ratio) {
        fract = parse(num, "counting", null, true, warn);
        fract += " ar ";
        fract += parse(denom, "counting", null, true, warn);
             
    } else {
    
        let dnoun;
        if (nd < 20) {
            let vals = ["naidiú", "aonu", "leath", "trian", "ceathrú",
                    "cúigiú",  "séú", "seachtú", "ochtú", 
                    "naoú",  "deichiú",  
                    "aondéagú", "dódhéagú", "trídéagú", "ceathairdéagú",
                    "cúigdéagú", "sédéagú", "seachtdéagú", "ochtdéagú",
                    "naoidéagú"];
            dnoun = vals[nd];
            
            if (nd == 1) {
                warn("Use of 1 in denominator not discussed in the standard");
            } else if (nd == 0) {
                warn("Use of 0 in denominator not discussed in the standard (and is mathematically suspect)");
            }
        } else {
            dnoun = parse(denom, "ordinal", null, false, warn);
            if (dnoun.startsWith("an ")) {
                dnoun = dnoun.substring(3);
                if (dnoun.startsWith("t-")){
                    dnoun = dnoun.substring(2);
                }
            }
        }
        if (num == "1") {
            fract = dnoun;
        } else {        
            fract = parse(num, "objects", dnoun, true);
        }
    }
    let nounSuffix = "";
    if (noun) {
        nounSuffix = " "+noun;
    }
    return signPrefix + fract + nounSuffix;
}

export default fractParse;

