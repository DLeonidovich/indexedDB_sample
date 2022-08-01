import { doors, DD } from "./indDB_data.js";

DD.timeSpan().innerHTML = DD.date();

// this function takes html template of SELECT section and created clones using data from obj "doors.createCmbBoxs"
function createCmbBoxs (obj, template) {
    for (const step in obj) {
        if (obj.hasOwnProperty(step)) {
            const tegData = obj[step];
            let clone = template.content.cloneNode(true);
            let label = clone.querySelector("label");
            let select = clone.querySelector("select");

            for (const prop in tegData) {
                if (Object.hasOwnProperty.call(tegData, prop)) {
                    switch (prop) {
                        case "text": label.innerText = tegData["text"]; break;
                        case "labelFor": label.setAttribute("for", tegData["labelFor"]); break;
                        case "name": select.setAttribute("name", tegData["name"]); break;
                        case "id": select.id = tegData["id"]; break;
                        case "dataProp": select.dataset.properties = tegData["dataProp"]; break;
                        case "disabled": select.setAttribute("disabled", tegData["disabled"]); break;
                        default: alert("Thomething wrong with Switch"); break;
                    }
                }
            }
            template.before(clone);
        }
    }
}
// this runs creation of html sections of SELECTs, taking from obj "doors.createCmbBoxs" such data as text, attributes, id and etc
createCmbBoxs(doors.createCmbBoxs, DD.templ());