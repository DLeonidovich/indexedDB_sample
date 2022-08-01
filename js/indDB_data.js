let DD = {
    // html elements 
    container:  () => {return document.querySelector(".container")},
    templ:  () => {return document.querySelector("template")},
    form:   () => {return document.forms[0]},
    tm:     () => {return document.querySelector("#select-tm")},
    model:  () => {return document.querySelector("#select-model")},
    decor:  () => {return document.querySelector("#select-decor")},
    glass:  () => {return document.querySelector("#select-glass")},
    design: () => {return document.querySelector("#select-design")},
    lines:  () => {return document.querySelector("#select-lines")},
    decorStyle: () => {return document.querySelector("#select-decor-style")},
    instock:    () => {return document.querySelector("#check-in-stock")},
    timeSpan:   () => {return document.querySelector("#db-form-date > span")},
    tmLogoPic:  () => {return document.querySelector("#tm-logo-pic")},
    recTime:  () => {return document.querySelector("#create-date")},
    //
    loadingSpan:    () => {return document.querySelector("#loading");},
    doorsListTable: () => {return document.querySelector("#doors-list-table");},

    fmDSetAttr: function () {return this.form().dataset.doorsTm}, // value of form > data-doors-tm attribute
    tmOption4:  function () {return this.tm().options[3].value.slice(3)}, // not in use
    this:       function () {console.log(this.tm())}, // temp

    

    // methods
    date: () => {
        let dt = new Date();
        return dt.getFullYear() + "-" + (dt.getMonth()+1) + "-" +  dt.getDate() + " Time: " + dt.getHours() + ":" + dt.getMinutes();
        },
    resetForm: () => {
        document.forms[0].querySelectorAll("[data-properties='toReset']").forEach(select => select.innerHTML = "");
        document.forms[0].querySelectorAll("input[data-properties='toReset']").forEach(cbox => cbox.checked = false);
        document.querySelector("#create-date").innerHTML = "";
        //document.querySelector("#doors-list-table").innerHTML = "";
        //location.reload(true);
    }
}
//--------------------------------------------------------------------------------

let doors = {
    tm: ["TM KORFAD", "TM LEADOR", "TM DARUMI", "TM OMEGA"],
    
    KORFAD: {
        model: {
            "PORTO": ["PR-01", "PR-05", "PR-08", "PR-12"],
            "PORTO DELUXE": ["PD-01", "PD-03", "PD-12"],
            "VENECIA DELUXE": ["VND-01", "VND-02", "VND-03"]
        },
        decor: ["VENGE", "OAK BRUSH", "OAK TOBACCO", "ESH-WHITE"],
        glass: ["satin-white", "satin-bronze", "black", "no-glass"],
        logo: "./img/korfad/KORFAD_Logo.svg",
    },
    
    LEADOR: {
        model: ["NEAPOL", "SOVANA", "MALTA", "LAZIO", "VERONA"],
        decor: ["WHITE MAT", "MOKKO OAK", "LATTE OAK", "MONTBLANC"],
        glass: ["satin-white", "satin-bronze", "satin-graphit", "black", "no-glass"],
        logo: "./img/leador/LEADOR_Logo.svg",
    },

    DARUMI: {
        model: ["VELA", "LEONA", "VERSAL", "MASEL", "BORDO", "MADRID", "NEXT", "SENATOR", "COLUMBIA", "AVANT", "SELESTA", "PRIME", "GALANT-01", "GALANT-02", "PLATO", "PLATO LINE PTL-01", "PLATO LINE PTL-02", "PLATO LINE PTL-03", "PLATO LINE PTL-04"],
        decor: ["OLS OAK", "BORON OAK", "NATURAL OAK", "ROYAL NUT"],
        glass: ["satin-white", "satin-bronze", "satin-graphit", "black", "no-glass"],
        logo: "./img/darumi/DARUMI_Logo.svg",
    },

    OMEGA: {
        model: {
            "ART VISION": ["A1", "A2", "A3", "A4", "A5"],
            "LINES": ["L3", "L7", "F5", "F6"],
            "AMORE CLASSIC": ["NICCA PG", "NICCA POO", "ROME PG", "ROME POO", "FLORENCE PG", "LONDON PG", "LONDON PO", "MILANO PG", "MILANO PO", "ROME VENECIANO PG"],
        },
        decor: ["WHITE", "BEIGE", "RAL-7037", "RAL-7040", "RAK-1013"],
        glass: ["satin-white double sided", "no-glass"],
        logo: "./img/omega/OMEGA_Logo.svg",
    },

    design: ["modern", "provance", "classic", "plate"],
    
    lines: ["horizontal", "vertical", "horisontal/vertical"],
    
    decorStyle: ["wood", "monotone", "beton", "art", "painted"],

    createCmbBoxs: {
        tm: {
            text: "Step 1. Choose doors' TM:",
            labelFor: "select-tm",
            name: "select-tm",
            id: "select-tm",
            dataProp: "",
            disabled: "false",
        },
        model: {
            text: "Step 2. Choose model:",
            labelFor: "select-model",
            name: "select-model",
            id: "select-model",
            dataProp: "toReset",
            disabled: "true",
        },
        decor: {
            text: "Step 3. Choose decor:",
            labelFor: "select-decor",
            name: "select-decor",
            id: "select-decor",
            dataProp: "toReset",
            disabled: "true",
        },
        glass: {
            text: "Step 4. Choose glass",
            labelFor: "select-glass",
            name: "select-glass",
            id: "select-glass",
            dataProp: "toReset",
            disabled: "true",
        },
        design: {
            text: "Step 5. Choose design:",
            labelFor: "select-design",
            name: "select-design",
            id: "select-design",
            dataProp: "toReset",
            disabled: "true",
        },
        lines: {
            text: "Step 6. Choose lines:",
            labelFor: "select-lines",
            name: "select-lines",
            id: "select-lines",
            dataProp: "toReset",
            disabled: "true",
        },
        decorStyle: {
            text: "Step 7. Choose decor style:",
            labelFor: "select-decor-style",
            name: "select-decor-style",
            id: "select-decor-style",
            dataProp: "toReset",
            disabled: "true",
        },
    },
    // ---------- indexedDB DATA ------------
    // Names of STORAGEs for indexed_DB
    //dbStorNames: ["KORFAD", "LEADOR", "DARUMI", "OMEGA"],
    dbStorNames: function () {return this.tm.map((tName) => tName.slice(3))},
    // Names of indexes in mentioned STORAGEs
    indexNames: ["Decor", "Glass", "Design", "Lines", "DecorStyle", "Instock"],
}

export { doors, DD };