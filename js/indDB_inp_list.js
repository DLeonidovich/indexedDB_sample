import { doors, DD } from "./indDB_data.js";

// Class for creation lists of OPTIONs for SELECTs. The data (names, etc) is taken from indDB_data.js > "doors" obj-ct
let CreateOptionsLists = class {    
    constructor (elem, optionsContent) {
        this.select = elem;
        this.data = optionsContent;
    }
    makeOptList() {
        let fragment = document.createDocumentFragment();
        if (Array.isArray(this.data)) {  // if array
            this.data.forEach(item => {
                let el = document.createElement("option");
                el.value = item;
                el.textContent = item;
                fragment.appendChild(el);
            });
            this.select.append(fragment);
            this.select.disabled = false;
        } else {
            for (const serie in this.data) { // if bject
                if (this.data.hasOwnProperty(serie)) {
                    
                    const modelsList = this.data[serie];
                    modelsList.forEach(model => {
                        let el = document.createElement("option");
                        el.value = serie + " " + model;
                        el.textContent = serie + " " + model;
                        fragment.appendChild(el);
                    });
                    
                }
            }
            this.select.append(fragment);
            this.select.disabled = false;
        }
    }
}

let makeOptionsList = function (elem, dataRef) {
    new CreateOptionsLists(elem, dataRef).makeOptList();
}

// this creates OPTIONS for all SELECTs except the first one - doors TM
let tmChosenHandler = function (tmark) {
    DD.resetForm();
    DD.form().dataset.doorsTm = tmark;
    DD.container().dataset.doorsTm = tmark;
    DD.tmLogoPic().src = eval(`doors.${tmark}.logo`);

    makeOptionsList(DD.model(), eval(`doors.${tmark}.model`)); // makes options list of door Models
    makeOptionsList(DD.decor(), eval(`doors.${tmark}.decor`)); // makes options list of door Decors
    makeOptionsList(DD.glass(), eval(`doors.${tmark}.glass`)); // makes options list of door Glass

    makeOptionsList(DD.design(), doors.design);
    makeOptionsList(DD.lines(), doors.lines);
    makeOptionsList(DD.decorStyle(), doors.decorStyle);
}



// listen to TM SELECT and run the creation of exemplars of OPTIONS lists for the rest SELECTs using chosen TM
DD.form().addEventListener("change", (ev) => {        
        
    //if (ev.target.tagName === "SELECT" && ev.target.id === "select-tm") {
    if (ev.target.tagName === "SELECT" && ev.target.id === "select-tm") {
        //DD.resetForm();
        let tmark = ev.target.value.slice(3);
        tmChosenHandler(tmark);
    }
});

DD.form().addEventListener("dblclick", (ev) => {
    if (ev.target.tagName === "SELECT" && ev.target.id === "select-tm") {
        //DD.resetForm();
        let tmark = ev.target.value.slice(3);
        tmChosenHandler(tmark);
    }
});

//on start, creates exemplar of OPTIONs for the trade marks SELECT using data from "doors.tm" obj
new CreateOptionsLists(DD.tm(), doors.tm).makeOptList();
// and using this TM,creates all the rest exemplars of OPTIONs of all SELECTs
tmChosenHandler(DD.tm().value.slice(3));

export { tmChosenHandler, makeOptionsList, CreateOptionsLists };