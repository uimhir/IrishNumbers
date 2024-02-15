import parse from "./parse.js";
import fractParse from "./fractParse.js";
import App from "./App.js";

// This class runs a series of tests against the renderer.
// These tests are mostly derived from Chapter 9 of the Caighdean Oifigiul
// Note that many of the examples given there relate to the other than
// the nominative case or to how adjectives are affected by numbers.
// Some also, especially for fractions, illustrate options for rendering
// that this program does not support.  With those constraints in mind
// the goal is for all pass examples in the standard.
//
// Additional tests that check special cases not in the examples given in the
// standard are are also included, especially in the case of decimal numbers
// for which the standard gives no tabular examples.
//
// A couple of tests in the personal numbers (table 9s) were modified (1 bean -> bean rather than bean amhain)
// which is a different option but seemingly valid by the text.
// One test (in 9c) is deliberately failed since it requires eclipsis of the word for billion
// making 17,000,000,000 indistinguishable from 17,000,000 orally.
// 
// One test (table 9dd) in fractions was omitted since it used a denominator that our
// program chose to render using a different option. 

class Tests {
    
    
    results() {
        const testData = [
            
        ];
        // 9.2 maoluimhir
        testData.push(...table9a());
        testData.push(...table9b());
        testData.push(...table9c());
        testData.push(...table9d());
        testData.push(...table9e());
        // 9.3 bunuimhir
        testData.push(...table9f());
        testData.push(...table9h());
        testData.push(...table9n());
        testData.push(...table9o());
        // 9.4 uimhir phearsanta
        testData.push(...table9s());
        // 9.5 orduimhir
        testData.push(...table9v());
        testData.push(...table9w());
        // 9.6 codán
        testData.push(...table9y());
        testData.push(...table9aa());
        testData.push(...table9dd());
        
        // 9.7 uimhir deachúlach
        // No tables in 9.7.  We do some decimals and grab
        // some examples from the text.  Also test +/- prefixes.
        testData.push(...plusMinusDecimal());
        
        let dfts = {context: "counting", simple: true, noun: "", number: ""};
        
        let result = null;
                
        let summary = "";  
        let countOK  = 0;
        let countErr = 0;
        function showWarning(text) {
            console.log("Got warning:",text);
            
        }
        
        for (let i=0; i<testData.length; i += 1) {
            let inputs = testData[i].inputs; 
            let state  = {...dfts};
            for (let field in inputs) {
                state[field] = inputs[field];
            }
            
            result = doParse(state)
            if (result == testData[i].output) {
                countOK += 1;
            } else {
                countErr += 1;
                let diffPos = differ(result, testData[i].output);
                summary += "Test "+i+", diff at "+diffPos + " for " + state.number+" ["+state.context+"/"+state.noun+"/"+state.simple+"]: Got '"+result+"' not '"+testData[i].output+"' \n";
            }            
        }
        summary += "\n\nSummary:\n";
        summary += "\nTotal number of tests: "+testData.length+"\n";
        summary += "Count Passed: "+countOK+"\n";
        summary += "Count Failed: "+countErr +"\n";
        
        return summary;
        
        function differ(a, b) {
            let pos = 0;
            if (a == null || b == null || a.length == 0 || b.length == 0) {
                return 0;                
            }
            while (true) {
                if (pos >= a.length || pos >= b.length) {
                    return pos;                    
                }
                if (a.charAt(pos) != b.charAt(pos)) {
                    return pos;
                }
                pos += 1;
            }
        }
        
        function doParse(state) {
            if (state.number.indexOf("/") > 0) {
                let vals = state.number.match(App.fract);
                return fractParse(vals[1], vals[2], vals[3], state.noun, state.simple, showWarning);
            } else {
                return parse(state.number, state.context, state.noun, state.simple, showWarning);
            }
        }
        
        
        function table9a() {
            let ins = [
[0,"náid"],
[1,"a haon"], 
[2,"a dó"], 
[3,"a trí"], 
[4,"a ceathair"], 
[5,"a cúig"], 
[6,"a sé"], 
[7,"a seacht"], 
[8,"a hocht"], 
[9,"a naoi"], 
[10,"a deich"],
[11,"a haon déag"], 
[12,"a dó dhéag"], 
[13,"a trí déag"], 
[14,"a ceathair déag"], 
[15,"a cúig déag"], 
[16,"a sé déag"], 
[17,"a seacht déag"],
[18,"a hocht déag"], 
[19,"a naoi déag"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0]},output:xx[1].trim()};
            }
            return outs;

        }
        
        function table9b() {
            let ins = [
[20,"fiche"], 
[21,"fiche a haon"], 
[22,"fiche a dó"], 
[23,"fiche a trí"],
[24,"fiche a ceathair"], 
[25,"fiche a cúig"], 
[26,"fiche a sé"], 
[27,"fiche a seacht"], 
[28,"fiche a hocht"], 
[29,"fiche a naoi"],
[60,"seasca"], 
[64,"seasca a ceathair"], 
[65,"seasca a cúig"],
[66,"seasca a sé"],
[30,"tríocha"], 
[34,"tríocha a ceathair"], 
[35,"tríocha a cúig"],
[36,"tríocha a sé"],
[70,"seachtó"], 
[77,"seachtó a seacht"], 
[78,"seachtó a hocht"],
[79,"seachtó a naoi"],
[40,"daichead"], 
[47,"daichead a seacht"],
[48,"daichead a hocht"],
[49,"daichead a naoi"],
[80,"ochtó"], 
[81,"ochtó a haon"], 
[82,"ochtó a dó"], 
[83,"ochtó a trí"],
[50,"caoga"],
[51,"caoga a haon"], 
[52,"caoga a dó"], 
[53,"caoga a trí"],
[90,"nócha"], 
[94,"nócha a ceathair"], 
[95,"nócha a cúig"],
[96,"nócha a sé"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0]},output:xx[1].trim()};
            }
            return outs;

        }
        
        function table9c() {
             return [
{inputs: {number:"100"}, output:"céad"},
{inputs: {number:"200"}, output:"dhá chéad"},
{inputs: {number:"1,000"}, output:"míle"},
{inputs: {number:"4,000"}, output:"ceithre mhíle"},
{inputs: {number:"1,000,000"}, output:"milliún"},
{inputs: {number:"5,000,000"}, output:"cúig mhilliún"},
{inputs: {number:"1,000,000,000"}, output:"billiún"}, 
// This test should fail since we do not do eclipsis of billiun.
{inputs: {number:"17,000,000,000"}, output:"seacht mbilliún déag"}];
        }
        function table9d() {
            return [
// Table 9D
{inputs: {number:"103"}, output:"céad a trí"},
{inputs: {number:"1,001"}, output:"míle a haon"},      
{inputs: {number:"115"}, output:"céad a cúig déag"},
{inputs: {number:"1126"}, output: "míle, céad fiche a sé"},
{inputs: {number:"120"}, output:"céad fiche"},
{inputs: {number:"1,230"}, output:"míle, dhá chéad tríocha"},
{inputs: {number:"120"}, output:"céad fiche"}, 
{inputs: {number:"1,230"}, output:"míle, dhá chéad tríocha"},
{inputs: {number:"181"}, output:"céad ochtó a haon"}, 
{inputs: {number:"2,915"}, output:"dhá mhíle, naoi gcéad a cúig déag"},
{inputs: {number:"273"}, output:"dhá chéad seachtó a trí"}, 
{inputs: {number:"3,824"}, output:"trí mhíle, ocht gcéad fiche a ceathair"},
{inputs: {number:"355"}, output:"trí chéad caoga a cúig"}, 
{inputs: {number:"4,733"}, output:"ceithre mhíle, seacht gcéad tríocha a trí"},
{inputs: {number:"446"}, output:"ceithre chéad daichead a sé"}, 
{inputs: {number:"5,642"}, output:"cúig mhíle, sé chéad daichead a dó"},
{inputs: {number:"519"}, output:"cúig chéad a naoi déag"}, 
{inputs: {number:"6,551"}, output:"sé mhíle, cúig chéad caoga a haon"},
{inputs: {number:"657"}, output:"sé chéad caoga a seacht"}, 
{inputs: {number:"7,460"}, output:"seacht míle, ceithre chéad seasca"},
{inputs: {number:"734"}, output:"seacht gcéad tríocha a ceathair"}, 
{inputs: {number:"8,379"}, output:"ocht míle, trí chéad seachtó a naoi"},
{inputs: {number:"818"}, output:"ocht gcéad a hocht déag"}, 
{inputs: {number:"9,288"}, output:"naoi míle, dhá chéad ochtó a hocht"},
{inputs: {number:"999"}, output:"naoi gcéad nócha a naoi"}, 
{inputs: {number:"9,999"}, output:"naoi míle, naoi gcéad nócha a naoi"}];
        }
        
        function table9e() {
            let ins = [
["13,452", "trí mhíle dhéag, ceithre chéad caoga a dó", "trí déag míle, ceithre chéad caoga a dó"],
["18,901", "ocht míle dhéag, naoi gcéad a haon", "ocht déag míle, naoi gcéad a haon"],
["38,482", "ocht míle is tríocha, ceithre chéad ochtó a dó", "tríocha a hocht míle, ceithre chéad ochtó a dó"],
["65,155", "cúig mhíle is seasca, céad caoga a cúig", "seasca a cúig míle, céad caoga a cúig"],
["74,048", "ceithre mhíle is seachtó, daichead a hocht", "seachtó a ceathair míle, daichead a hocht"],
["92,827", "dhá mhíle is nócha, ocht gcéad fiche a seacht", "nócha a dó míle, ocht gcéad fiche a seacht"],
["116,104", "céad is sé mhíle dhéag, céad a ceathair", "céad a sé déag míle, céad a ceathair"],
["520,712", "cúig chéad is fiche míle, seacht gcéad a dó dhéag", "cúig chéad fiche míle, seacht gcéad a dó dhéag"],
["974,345", "naoi gcéad seachtó is ceithre mhíle, trí chéad daichead a cúig", "naoi gcéad seachtó a ceathair míle, trí chéad daichead a cúig"]];
        
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0], simple:false},output:xx[1].trim()};
            }
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i+ins.length]= {inputs: {number:xx[0]},output:xx[2].trim()};
            }
            
            return outs;
        }
    
        function table9f() {
            let ins = [
    [1, "bád", " aon bhád amháin"],
    [1 , "ábhar", " aon ábhar amháin"],
    [11 , "bád", " aon bhád déag"],
    [11 , "ábhar", " aon ábhar déag"],
    [2 , "bád", " dhá bhád"],
    [2 , "ábhar", " dhá ábhar"],
    [12 , "bád", " dhá bhád déag"],
    [12 , "oíche", " dhá oíche dhéag"],
    [3 , "bád", " trí bhád"],
    [3 , "ábhar", " trí ábhar"],
    [13 , "bád", " trí bhád déag"],
    [13 , "ábhar", " trí ábhar déag"],
    [4 , "bád", " ceithre bhád"],
    [4 , "ábhar", " ceithre ábhar"],
    [14 , "bád", " ceithre bhád déag"],
    [14 , "ábhar", " ceithre ábhar déag"],
    [5 , "bád", " cúig bhád"],
    [5 , "ábhar", " cúig ábhar"],
    [15 , "bád", " cúig bhád déag"],
    [15 , "oíche", " cúig oíche dhéag"],
    [6 , "bairille", " sé bhairille"],
    [6 , "oíche", " sé oíche"],
    [16 , "bairille", " sé bhairille dhéag"],
    [16 , "ábhar", "  sé ábhar déag"],
    [7 , "bairille", " seacht mbairille"],
    [7 , "oíche", " seacht n-oíche"],
    [17 , "bairille", " seacht mbairille dhéag"],
    [17 , "oíche", " seacht n-oíche dhéag"],
    [8 , "bairille", " ocht mbairille"],
    [8 , "oíche", " ocht n-oíche"],
    [18 , "bád", " ocht mbád déag"],
    [18 , "oíche", " ocht n-oíche dhéag"],
    [9 , "bairille", " naoi mbairille"],
    [9 , "oíche", " naoi n-oíche"],
    [19 , "bairille", " naoi mbairille dhéag"],
    [19 , "oíche", " naoi n-oíche dhéag"],
    [10 , "bairille", " deich mbairille"],
    [10 , "oíche", " deich n-oíche"],
// Added to tests given in Caighdean Oifigiul for special case of Euro discussed in CO 9.3.1.f, last clause.
// do not seimhiu deag after euro.,
    [14, "euro", "ceithre euro déag"],
// Added due to case discussed in 9.3.1.h/i, final clause
// Do not uru or seimhiu euro or cent
    [14, "cent", "ceithre cent déag"],
    [18, "cent", "ocht cent déag"],
    [18, "euro", "ocht euro déag"]];
    

            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0], context: "objects", noun: xx[1]},output:xx[2].trim()};
            }
            return outs;
        }
        
        
        
        function table9h() {
            let ins = [
[1,"bliain", 'aon bhliain amháin'], 
[11,'uair', 'aon uair déag'],
[2,'ceann', 'dhá cheann'],
[12,'pingin', 'dhá phingin déag'],
[3,'ceann', 'trí cinn'],
[13,'bliain', 'trí bliana déag'],
[4,'cloigeann', 'ceithre cloigne'],
[14,'ceann', 'ceithre cinn déag'],
[5,'fiche', 'cúig fichid'],
[15,'seachtain',  'cúig seachtaine déag'],
[6,'uair', 'sé huaire'],
[16,'cloigeann', 'sé cloigne déag'],
[7,'pingin', 'seacht bpingine'],
[17,'fiche', 'seacht bhfichid déag'],
[8,'seachtain', 'ocht seachtaine'],
[18,'troigh', 'ocht dtroithe déag'],
[9,'bliain', 'naoi mbliana'],
[19,'pingin', 'naoi bpingine déag'],
[10,'troigh', 'deich dtroithe'],
// Added to handle the special case of fiche which has a special dual form.
// ...  sounding like daichead...
[12, "fiche", "dhá fhichead déag"]
];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0], context: "objects", noun: xx[1]},output:xx[2].trim()};
            }
            return outs;
        }
        
        function table9n() {
            // Adjectives have been deleted from the examples given in the Caighdean Oifigiul.
            let ins = [
[21 ,"capall", "capall is fiche",           "fiche a haon capall"],
[33 ,"oíche",  "trí oíche is tríocha",       "tríocha a trí oíche"],
[42, "capall", "dhá chapall is daichead",    "daichead a dó capall"],
[55, "fuinneog","cúig fhuinneog is caoga",   "caoga a cúig fuinneog"],
[67, "leabhar", "seacht leabhar is seasca",  "seasca a seacht leabhar"],
[74, "pingin",  "ceithre pingine is seachtó","seachtó a ceathair pingin"],
[86, "bó",      "sé bhó is ochtó",           "ochtó a sé bó"],
[99, "bád",     "naoi mbád is nócha",        "nócha a naoi bád"]]           
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0], context: "objects", noun: xx[1], simple: false},output:xx[2].trim()};
            }
            
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i+ins.length]= {inputs: {number:""+xx[0], context: "objects", noun: xx[1], simple: true},output:xx[3].trim()};
            }

            return outs;
        }
        
        function table9o() {
            // Adjectives deleted.
            let ins = [
["191",     "méadar",  "céad nócha is aon mhéadar amháin", "céad nócha a haon méadar"],
["282",     "cat",    "dhá chéad ochtó is dhá chat", "dhá chéad ochtó a dó cat"],
["364",     "capall",  "trí chéad seasca is ceithre chapall", "trí chéad seasca a ceathair capall"],
["1,446",   "bó",      "míle, ceithre chéad daichead is sé bhó", "míle, ceithre chéad daichead a sé bó"],
["18,437",  "cás",     "ocht míle dhéag, ceithre chéad tríocha is seacht gcás", "ocht déag míle, ceithre chéad tríocha a seacht cás"],
["25,528",  "leabhar", "cúig mhíle is fiche, cúig chéad fiche is ocht leabhar", "fiche a cúig míle, cúig chéad fiche a hocht leabhar"],
["100,513", "milseán", "céad míle, cúig chéad is trí mhilseán déag", "céad míle, cúig chéad a trí déag milseán"]];        
        
            let outs = [];

            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0], context: "objects", noun: xx[1], simple:false}, output:xx[2].trim()};
                outs[i+ins.length]= {inputs: {number:xx[0], context: "objects", noun: xx[1]},    output:xx[3].trim()};
            }
            return outs;
        }
        
        
        function table9s() {
            // Nominative case only.
            let ins = [
                
//[1, 'fear','fear amháin'],   // Believe the following form is also allowed and that is waht we support.
//[1, 'bean','bean amháin'],
[1, "fear", "fear"],
[1, "bean", "bean"],
[2, 'bean','beirt bhan'],
[3, 'bádóir','triúr bádóirí'],
[4, 'scoláire','ceathrar scoláirí'], 
[5, 'fear','cúigear fear'],
[6, 'bean','seisear ban'],
[7, 'bádóir','seachtar bádóirí'],
[8, 'báicéir','ochtar báicéirí'],
[9, 'fear','naonúr fear'],
[10, 'girseach','deichniúr girseach'],
[11, 'imreoir','aon imreoir déag'],
[12, 'bádóir','dháréag bádóirí']];

            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0], context: "people", noun: xx[1]},output:xx[2].trim()};
            }

            return outs;        
        }
        function table9v(){
            let ins = [
[1, "fear",        "an chéad fhear"], 
[11,"bean",       " an t-aonú bean déag"],
[20,"capall",     " an fichiú capall"],
[30, "bean",      " an tríochadú bean"],
[2, "bean",       "an dara bean"],
[12,"bosca",      " an dóú bosca déag"],
[21,"capall",     " an t-aonú capall is fiche"],
[39,"oíche",      " an naoú hoíche is tríocha"],
[3, "leabhar",    " an tríú leabhar"],
[13,"méadar",     " an tríú méadar déag"],
[22,"bean",       " an dóú bean is fiche"],
[40,"cuairteoir",  " an daicheadú cuairteoir"],
[4, "méadar",     " an ceathrú méadar"],
[14,"bád",         "an ceathrú bád déag"],
[23,"leabhar",     " an tríú leabhar is fiche"],
[48,"bó",          " an t-ochtú bó is daichead"],
[5, "bád",         " an cúigiú bád"], 
[15,"ábhar",       " an cúigiú hábhar déag"],
[24,"méadar",      " an ceathrú méadar is fiche"],
[57,"fuinneog",    " an seachtú fuinneog is caoga"],
[6, "ábhar",       " an séú hábhar"], 
[16,"bó",          "an séú bó déag"],
[25,"bád",         " an cúigiú bád is fiche"],
[66,"ábhar",       "an séú hábhar is seasca"],
[7, "fuinneog",    " an seachtú fuinneog"],
[17,"fuinneog",    " an seachtú fuinneog déag"],
[26,"ábhar",       " an séú hábhar is fiche"],
[75,"bád",         " an cúigiú bád is seachtó"],
[8, "bó",          " an t-ochtú bó "],
[18,"oíche",       " an t-ochtú hoíche déag"],
[27,"fuinneog",    " an seachtú fuinneog is fiche"],
[84,"méadar",      " an ceathrú méadar is ochtó"],
[9, "oíche",       " an naoú hoíche"],
[19,"capall",      " an naoú capall déag"],
[28,"bó",          " an t-ochtú bó is fiche"],
[93,"leabhar",     " an tríú leabhar is nócha"],
[10,"capall",      " an deichiú capall"],
[29,"oíche",       " an naoú hoíche is fiche"],
[100,"custaiméir", " an céadú custaiméir"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:""+xx[0], context: "ordinal", noun: xx[1]},output:xx[2].trim()};
            }
            return outs;


            
        }
        
        function table9w() {
            let ins = [
["104",     "feirmeoir",  "an céad is ceathrú feirmeoir"],
["1007",    "bliain",    "an míle is seachtú bliain"],
["116",     "babhta",    "an céad is séú babhta déag "],
["7219",    "méadar",    "an seacht míle, dhá chéad is naoú méadar déag"],
["131",     "capall",    "an céad tríocha is aonú capall "],
["10,000",  "lá",        "an deich míliú lá"],
["132",     "asal",      "an céad tríocha is dóú hasal "],
["223,413", "cloigeann", "an dá chéad fiche is trí mhíle, ceithre chéad is tríú cloigeann déag"],
["211",     "bád",        "an dá chéad is aonú bád déag "],
["613,564", "bó" ,       "an sé chéad is trí mhíle dhéag, cúig chéad seasca is ceathrú bó"],
["1,000" ,  "eitilt",    "an míliú heitilt "],
["1,000,000","uair",     "an milliúnú huair"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0], context: "ordinal", noun: xx[1]},output:xx[2].trim()};
            }
            return outs;
        }
    
        
        function table9y() {
            let ins = [
["1/2", " leath"],
["1/3", " trian"],
["1/4", " ceathrú"],
["1/5", " cúigiú"],
["1/6", " séú"],
["1/7", " seachtú"],
["1/8", " ochtú"],
["1/9", " naoú"],
["1/10", " deichiú"],
["1/11", " aondéagú"],
["1/12", " dódhéagú"],
["1/13", " trídéagú"],
["1/14", " ceathairdéagú"],
["1/15", " cúigdéagú"],
["1/16", " sédéagú"],
["1/17", " seachtdéagú"],
["1/18", " ochtdéagú"],
["1/19", " naoidéagú"]]; 
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0]},output:xx[1].trim()};
            }
            return outs;
        
               
        }
        
        function table9aa() {
            let ins = [
["3/2", " trí leath"], 
["2/11", " dhá aondéagú"], 
["4/30", " ceithre thríochadú"],
["2/3", " dhá thrian"],
["3/12", " trí dhódhéagú"], 
["5/40", " cúig dhaicheadú"],
["5/4", " cúig cheathrú"],
["4/13", " ceithre thrídéagú"],
["6/50", " sé chaogadú"],
["4/7", " ceithre sheachtú"],
["7/16", " seacht sédéagú"], 
["9/80", " naoi n-ochtódú"],
["8/9", " ocht naoú"], 
["9/18", " naoi n-ochtdéagú"],
["9/100", " naoi gcéadú"],
["9/10", " naoi ndeichiú"],
["6/19", " sé naoidéagú "],
["3/1000", " trí mhíliú"],
["10/3", " deich dtreana "],
["3/20", " trí fichiú "],
["5/1000000", " cúig mhilliúnú"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0]},output:xx[1].trim()};
            }
            return outs;

        } 
        
        // Testing only the implemented mode illustrated in this table.
        // One of the examples renders to a different format.
        function table9dd() {
            let ins=[
["23/29", "fiche a trí ar fiche a naoi"],
// Since the denominator is expressable as a single word  we use the format in table 9aa for this fraction. 
// ["13/30", "a trí déag ar thríocha"],
["32/81", "tríocha a dó ar ochtó a haon"],
["81/84", "ochtó a haon ar ochtó a ceathair"]];
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0]},output:xx[1].trim()};
            }
            return outs;

        }
        
        // Tests of decimal and signed numbers
        function plusMinusDecimal() {
            let ins = [
                ["-1", "lúide a haon"],
                ["+1", "moide a haon"],
                ["- 21", "lúide fiche a haon "],
                ["+ 21", "moide fiche a haon "],
                ["1.1", "a haon ponc a haon"],
                ["1.203", "a haon ponc a dó náid a trí"],
                ["-10.724", "lúide a deich ponc a seacht a dó a ceathair"],
                ["+11.0001", "moide a haon déag ponc náid náid náid a haon"],
                // The next few are from the standard in the text of section 9.9
                ["1.7", "a haon ponc a seacht"],
                ["22.4", "fiche a dó ponc a ceathair"],
                ["84.22", "ochtó a ceathair ponc a dó a dó"],
                ["1.2", "a haon ponc a dó gram", "gram"],
                ["1.5", "a haon ponc a cúig cileagram", "cileagram"],
                ["7.4", "a seacht ponc a ceathair méadar ciúbach", "méadar ciúbach"]];
                
            let outs = [];
            for (let i=0; i<ins.length; i += 1) {
                let xx = ins[i];
                outs[i]= {inputs: {number:xx[0]},output:xx[1].trim()};
                // Just a few have nouns.
                if (ins[i][2]) {
                    outs[i].inputs.noun = ins[i][2];
                }
            }
            return outs;
        }
    }
}

export default Tests;

