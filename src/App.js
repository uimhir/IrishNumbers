import {Component, createRef} from 'react';

import parse from "./parse.js";
import fractParse from "./fractParse.js";
import Tests from "./Tests.js";

class App extends Component {
    
    constructor(params) {
        super(params);
        this.warnings = [];
        
        this.state = {language:"english", 
                      number: "", 
                      context: "counting", 
                      noun: "", 
                      simple: true,
                      result: ""};
                
        this.checkParameters();
        this.startState= {...this.state};
        delete this.startState.language; // Don't switch languages on a reset.
    }
    // Regex for integers or decimals.
    // Note the use of the named reference 'com' to ensure that commas are
    // used consistently.
    static regex =/^([+-])?\s*(\d\d?\d?((?<com>,)?\d{3})?(\k<com>\d{3})*)(\.\d*)?$/;
    
    // Regex for fractions.
    static fract =/^([+-])?\s*(\d+)\s*\/\s*(\d+)$/;

    
    checkParameters() {
        let state = this.state;
        const sp = new URLSearchParams(window.location.search);
        let tst = "";
        if (sp.has("number")) {
            tst = sp.get("number");
        } else if (sp.has("uimhir")) {
            tst = sp.get("uimhir");
        }
        if (tst && !Number.isNaN(parseFloat(tst))) {
            state.number = tst;
        }
        tst = "";
        if (sp.has("context")) {
            tst = sp.get("context");
        } else if (sp.has("cineal")) {
            tst = sp.get("cineal");
        }
        if (tst) {
            if (tst == "counting" || tst == "maoluimhir") {
                state.context = "counting";
            } else if (tst == "objects"  || tst == "bunuimhir") {
                state.context = "objects";
            } else if (tst == "people" || tst == "uimhir phearsanta") {
                state.context = "people";
            } else if (tst == "ordinal" || tst == "orduimhir") {
                state.context = "ordinal";
            }
        }
        tst = "";
        if (sp.has("noun")) {
            tst = sp.get("noun");
        } else if (sp.has("ainmfhocal")) {
            tst = sp.get("ainmfhocal");
        }
        if (tst && tst.match( /^[\p{sc=Latn}\p{Nd}]*$/u))  {
            state.noun = tst;
        }
        
        tst = ""
        if (sp.has("simple")) {
            tst = sp.get("simple");
        } else if (sp.has("simplithe")) {
            tst = sp.get("simplithe");
        }
  
        if (tst) {
            if (tst == "t"  || tst == "1"  || tst == "true") {
                state.simple = true;
            } else {
                state.simple = false;
            }
        }
        
        if (sp.has("testing")) {
            this.testing = true;
        }
    }

    
    componentDidMount() {
        this.mayShow();
    }
    

    changeLanguage() {
        let newLang = this.state.language;
        if (newLang == "irish") {
            newLang = "english";
        } else {
            newLang = "irish";
        }
        this.setState({language:newLang});
    }
    
    updateNumber(e) {
        this.setState({number:e.target.value}, this.mayShow.bind(this));
    }
    updateNoun(e) {        
        this.setState({noun:e.target.value}, this.mayShow.bind(this));
    }
    updateSimple(e) {
        this.setState({simple:!this.state.simple}, this.mayShow.bind(this));
    }
    
    updateContext(e) {
        this.setState({context: e.target.value}, this.mayShow.bind(this));
    }
    
    reset() {
        let copy = {...this.startState};
        this.setState(copy);
    }
    
    warn(msg) {
        this.warnings.push(msg);
    }
    
    setResult(text) {
        this.setState({result: text});
    }
    
    mayShow() {
        if (this.testing) {
            return;
        }
        
        let number = this.state.number.trim();
        if (App.regex.test(number)) {
            this.show(number);
        } else if (App.fract.test(number)) {
            this.showFract(number);
        } else {
            this.setResult("");
        }
    }
    show(number) {
        let numb = parse(number, this.state.context, this.state.noun, this.state.simple, this.warn.bind(this));
        this.setResult(numb);
    }
    
    renderTesting() {
        let text = new Tests().results();
        return (
                <div> Test results 
                <pre>{text}</pre>
                </div>
                );
        
    }
    
    showFract(number) {
        let fields = number.match(App.fract);
        let sign = fields[1];
        let num  = fields[2];
        let denom = fields[3];
        if (num.startsWith("0")  && num.length > 1) {
            this.setResult("Error: illegal leading 0 in numerator");
        } else if (denom.startsWith("0") && denom.length > 1) {
            this.setResult("Error: illegal leading 0 in denominator");
        }
        let res = fractParse(sign, num, denom, this.state.noun, this.state.simple, this.warn.bind(this));
        this.setResult(res);
        
        
    }
    render() {
        if (this.testing) {
            return this.renderTesting();
        }
        let l   = this.state.language;
        let changeTo = "In English";
        if (l == "english") {
            changeTo = "As Gaeilge";
        }
        let wn = [];
        if (this.warnings.length > 0) {
            for (let i=0; i<this.warnings.length; i += 1) {
                wn[i] = <li key={i}>{this.warnings[i]}</li>;
            }
            // We'll lose the warnigns as soon as we re-render.
        }
        this.warnings = [];
        if (l == "english") {
            return this.renderEn(wn, changeTo);
        } else if (l == "irish") {
            return this.renderGa(wn, changeTo);
        } else {
            return this.unknownLanguage(); 
        }
    }
    
    unknownLanguage() {
        return (<div>Unknown Language</div>);
    }
    
    renderEn(wn, changeTo) {
        return ( 
                <div>
        <button onClick={this.changeLanguage.bind(this)}>{changeTo}</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="help.html">Help</a><br/>
                    <h2> Rendering Numbers into Irish Text </h2>
                    Enter a number and select the options for rendering.
                      <hr/><br/>
                      <table><tbody>
                      <tr><th align="right">Number:</th><td><input id="number" size="20" value={this.state.number} onChange={this.updateNumber.bind(this)}/></td></tr>
                      <tr><th align="right">Context:</th><td>
                    <select id="selbox" value={this.state.context} onChange={this.updateContext.bind(this)} >                     
                        <option value="counting">Abstract Numbers and Arithmetic</option>
                        <option value="objects">Counting Things</option>                        
                        <option value="people">Counting People</option>
                        <option value="ordinal">Ordering Things or People</option>
                        </select></td></tr>
                        <tr><th align="right">Noun:</th><td><input id="noun" size="15" value={this.state.noun} onChange={this.updateNoun.bind(this)}/></td></tr>
                      <tr><th align="right">Simple formats:</th><td><input id="simple" type="checkbox" checked={this.state.simple} 
                       onChange={this.updateSimple.bind(this)} /></td></tr> 
                       </tbody></table>
                       <hr/>
                    <button onClick={this.reset.bind(this)}> Reset</button>
                      <hr/> <strong>Result:</strong><p/>
                    <div id="result" >{this.state.result}</div>
                    <ul>{wn}</ul>
                </div>
        );
    }
    
    renderGa(wn, changeTo) {
        return ( 
                <div>
                    <button onClick={this.changeLanguage.bind(this)}>{changeTo}</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="help.html">Help</a><br/>
                    <h2>Uimhreacha a Chur i bhFocail </h2>
                      Iontráil uimhir agus roghnaigh na roghanna chun focail a rindreáil.                      <hr/><br/>
                      <table><tbody>
                      <tr><th align="right">Uimhir:</th><td><input id="number" size="20" value={this.state.number} onChange={this.updateNumber.bind(this)}/></td></tr>
                      <tr><th align="right">Cineál uimhir:</th><td>
                    <select id="selbox" value={this.state.context} onChange={this.updateContext.bind(this)} >                     
                        <option value="counting">Maoluimhir</option>
                        <option value="objects">Bunuimhir</option>                        
                        <option value="people">Uimhir Phearsanta</option>
                        <option value="ordinal">Orduimhir</option>
                        </select></td></tr>
                        <tr><th align="right">Ainmfhocal:</th><td><input id="noun" size="15" value={this.state.noun} onChange={this.updateNoun.bind(this)}/></td></tr>
                      <tr><th align="right">Foirm simplithe:</th><td><input id="simple" size="10" type="checkbox" checked={this.state.simple}
                       onChange={this.updateSimple.bind(this)} /></td></tr> 
                       </tbody></table>
                      <hr/>
                    <button onClick={this.reset.bind(this)}> Athshocrú </button>
                    <hr/> <strong>Toradh:</strong><p/>
                    <div id="result" >{this.state.result}</div>
                    <ul>{wn}</ul>
                </div>
        );
    }
}

export default App;
