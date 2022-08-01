import { doors, DD } from "./indDB_data.js";
import { tmChosenHandler, makeOptionsList, CreateOptionsLists } from "./indDB_inp_list.js";
import { bkup } from "./indDB_backup.js";

document.addEventListener("DOMContentLoaded", () => {
    if(!window.indexedDB) console.log("This browser doesn't support IndexedDB");
});

let db = null;
let dbOpenReq = indexedDB.open("intDoorsDB", 4);

dbOpenReq.addEventListener("error", (err) => {         // if ERROR
    console.warn(err);
});

dbOpenReq.addEventListener("success", (ev) => {        // if SUCCESS
    db = ev.target.result; // new DB is created
    console.log(new Date() + "DB creation success: " + db);
});

dbOpenReq.addEventListener("upgradeneeded", (ev) => {  // if UPGRADENEEDED
    db = ev.target.result;
    let oldVersion = ev.oldVersion;
    let newVersion = ev.newVersion || db.vertion;
    console.log("The DB has been upgrated from ", oldVersion, "to ", newVersion, "!");
    createDBFolders();

    // 1. This creates FOLDERS / STORAGES for records in DB
    function createDBFolders () {
        doors.dbStorNames().forEach(store => {
            if (!db.objectStoreNames.contains(store)) {
                let objStore = db.createObjectStore(store, {
                    keyPath: "id", // as option { keyPath: "id", autoIncrement: true }
                });
                createIndxsForFolders(objStore);
            } else {
                console.warn("!This storage name is already exists!");
                //db.deleteObjectStore(store);
            }
        });
    }
    // 2. This creates INDEXES for FOLDERS
    function createIndxsForFolders (objStore) {
        doors.indexNames.forEach(name => {
            let arg1 = name;
            let arg2 = name;
            objStore.createIndex(`${arg1}`, `${arg2}`, {unique: false});
        });
    }

});

//----------------------------------------------------------------------------------------------

DD.form().addEventListener("click", (ev) => {
    if (ev.target.tagName == "INPUT" && ev.target.id == "addButton") {
        ev.preventDefault();
        addHandler();
    }

    if (ev.target.tagName == "INPUT" && ev.target.id == "clearButton") {
        ev.preventDefault();
        DD.resetForm();
    }
    
    if (ev.target.tagName == "INPUT" && ev.target.id == "getButton") {
        ev.preventDefault();
        getDBData("getAll");
    }

    if (ev.target.tagName == "INPUT" && ev.target.id == "uppdButton") {
        ev.preventDefault();
        uppdHandler();
    };
    
    if (ev.target.tagName == "INPUT" && ev.target.id == "delButton") {
        ev.preventDefault();
        delHandler();
    }
    if (ev.target.tagName == "INPUT" && ev.target.id == "bkupButton") {
        ev.preventDefault();
        bkupRetrieve();
    }
    
});


//1) ADD HANDLER
function addHandler () {
    //let instock_ = DD.instock().checked === true ? "Yes" : "No";
    let currentDoor = {
        id: unID(),
        TM:       DD.tm().value,
        Model:    DD.model().value,
        Decor:    DD.decor().value,
        Glass:    DD.glass().value,
        Design:   DD.design().value,
        Lines:    DD.lines().value,
        DecorStyle: DD.decorStyle().value,
        //Instock:  DD.instock().checked,
        Instock:  DD.instock().checked === true ? "Yes" : "No",
        Date:     DD.date(),
    }
    const folderName = currentDoor.TM.slice(3);        
    let tx = makeTX(folderName, "readwrite");
    tx.oncomplete = (ev) => {
        //console.log(ev);
    };
    let request = tx.objectStore(folderName).add(currentDoor);  // method ADD
    
    request.onsuccess = (ev) => {
        console.log("Successfully added new door");
        getDBData("getAll");
    };
    request.onerror = (err) => {
        console.warn("Error occurred while request to add new door");
    }
}

// 2) Get all records handler. method GETALL

function getDBData(method) {
    
    DD.loadingSpan().style.display = "block";
    DD.doorsListTable().innerHTML = "";
    let docFrgm = document.createElement("table");
    let counter = 0;
    //let consolArr = [];
    doors.dbStorNames().forEach(folder => {
        let tx = makeTX(folder, "readonly");
        tx.oncomplete = (ev) => {
            console.log("Ok - getAll fn");
        };
        let store = tx.objectStore(folder);
        let req;
        switch (method) {
            case "getAll": req = store.getAll(); break; // method GET ALL
            case "design": req = store.index("Design").getAll(); break; // getAll from index Design
            case "decor": req = store.index("Decor").getAll(); break; // getAll from index Decor
            case "glass": req = store.index("Glass").getAll(); break;
            case "lines": req = store.index("Lines").getAll(); break;
            case "decorStyle": req = store.index("DecorStyle").getAll(); break;
            case "instock": req = store.index("Instock").getAll(); break;
            default:
                break;
        }
        //let getReq = store.getAll(); // method GET ALL
        req.onsuccess = (ev) => {
            let arr = ev.target.result;
            //arr.forEach(obj => consolArr.push(obj));
            for (let i = 0; i < arr.length; i++) {
                    counter++;
                    let tr = document.createElement("tr");
                    tr.dataset.key = arr[i].id;
                    tr.dataset.tm = arr[i].TM;
                    tr.innerHTML = `<td>${counter}</td>
                                    <td>${arr[i].TM}</td>
                                    <td>${arr[i].Model}</td>
                                    <td>${arr[i].Decor}</td>
                                    <td>${arr[i].Glass}</td>
                                    <td>${arr[i].DecorStyle}</td>
                                    <td>${arr[i].Design}</td>
                                    <td>${arr[i].Lines}</td>
                                    <td>${arr[i].Date}</td>
                                    <td>${arr[i].Instock}</td>
                                    <td><input type="checkbox" name="rowCheck" title="check to delete"></input></td>`;
                    docFrgm.appendChild(tr);
            }
        }
        req.onerror = (err) => {
            console.warn(err);
        }            
    });
    let headTr = document.createElement("tr");
    headTr.innerHTML = `<th>#</th> <th>Trade Mark:</th> <th>Model:</th> 
                        <th title="Click to get sorted" data-thHover="yes">Decor:</th>
                        <th title="Click to get sorted" data-thHover="yes">Glass:</th>
                        <th title="Click to get sorted" data-thHover="yes">Decor Style:</th>
                        <th title="Click to get sorted" data-thHover="yes">Design:</th>
                        <th title="Click to get sorted" data-thHover="yes">Lines:</th>
                        <th>Rec date:</th>
                        <th title="Click to get sorted" data-thHover="yes">Instock:</th> <th>Sct</th>`;
    docFrgm.prepend(headTr);
    DD.doorsListTable().appendChild(docFrgm);
    setTimeout(() => {DD.loadingSpan().style.display = "none"}, 2000);

    //console.log(consolArr);
}



// 3) Uppdate handler, method PUT
function uppdHandler () {
    if (!DD.doorsListTable().innerHTML == "") {
        if (DD.doorsListTable().querySelector("tr[data-is-active='active']")) {
            confirm("Update the record?");
            let selecteKey = DD.doorsListTable().querySelector("tr[data-is-active='active']").dataset.key;
            let updObj = {            
                id: selecteKey,
                TM:       DD.tm().value,
                Model:    DD.model().value,
                Decor:    DD.decor().value,
                Glass:    DD.glass().value,
                Design:   DD.design().value,
                Lines:    DD.lines().value,
                DecorStyle: DD.decorStyle().value,
                Instock:  DD.instock().checked,
                Date:     DD.date(),
            }
            let tx = makeTX(updObj.TM.slice(3), 'readwrite');
            tx.oncomplete = (ev) => {
                //console.log(ev.target);
            }
            let reqDel = tx.objectStore(updObj.TM.slice(3)).put(updObj);
            reqDel.onsuccess = (ev) => {
                console.log("Record has been successfuly updated");
                getDBData("getAll");
            }
            reqDel.onerror = (err) => {
                console.warn(err);
            }
        } else {alert("Select record from the list to update record in DB!")};
    } else {alert("At first, create list of records by 'Get list' button!")};
}

// 4) Delete hanldler by key, method DELETE
function delHandler () {
    let arr = [];
    if (!DD.doorsListTable().innerHTML == "") {
        let checkTds = DD.doorsListTable().querySelectorAll("tr>td>input[name='rowCheck']");
        //console.log(checkTds); // - all inputs but we need all checked rows
        checkTds.forEach(inp => {
            if (inp.checked) {
                //arr.push(inp.parentElement.parentElement.dataset.key);
                //arr.push(inp.closest("tr").dataset.key);
                arr.push(inp.closest("tr"));
            }
        })
        if (arr.length == 0) {
            alert("Check any record to delete them from DB!");
        } else {
            deleteByKeyFn(arr);
        }        
    } else {
        alert("At first, create list of records by get list button!");
    }    
}

function deleteByKeyFn (arr) {
    let conf = confirm("Do really want to delete selected records?");
    if (conf) {
        //let tx = makeTX("intDoorsDB", "readwrite");
        arr.forEach((tr) => {                
            let folder = tr.children[1].innerHTML.slice(3);
            let key = tr.dataset.key;
            
            let tx = makeTX(folder, "readwrite");
            tx.onsuccess = (ev) => {
                //getAllHandler();
                // do something
            }
            let reqDel = tx.objectStore(folder).delete(key);
            reqDel.onsuccess = (ev) => {
                console.log("Records have been deleted!");
                //move on to the next request in the transaction or
                //commit the transaction
                getDBData("getAll");
            };
            reqDel.onerror = (err) => {
                console.log('error in request to delete');
            };
        });
    } else return;
}


DD.doorsListTable().addEventListener("click", (ev) => {
    if (ev.target.tagName == "TD") {
        selectTR(ev);
    }
    if (ev.target.tagName == "TH") {
        sortByIndex(ev);
    }
});

// 4) Get selected record, method GET
function selectTR (ev) {
    document.querySelectorAll("[data-is-active]").forEach(tr => tr.dataset.isActive = (""));
    ev.target.parentElement.dataset.isActive = "active";
    let key = ev.target.parentElement.dataset.key;
    let foldName = ev.target.parentElement.children[1].innerHTML.slice(3);
    
    let tx = makeTX(foldName, "readonly");
    tx.oncomplete = (ev) => {
        // do something on transaction complete
    }
    let getReq = tx.objectStore(foldName).get(key); // method GET
    getReq.onsuccess = (ev) => {
        //console.log(ev.target.result); it's the same as "getReq.result"
        let rslt = getReq.result;
        tmChosenHandler(rslt["TM"].slice(3)); // this makes options lists according to TM value

        DD.tm().value = rslt["TM"];
        DD.model().value = rslt["Model"];
        DD.decor().value = rslt["Decor"];
        DD.glass().value = rslt["Glass"];
        DD.design().value = rslt["Design"];
        DD.lines().value = rslt["Lines"];
        DD.decorStyle().value = rslt["DecorStyle"];
        DD.instock().checked = rslt["Instock"];
        DD.recTime().innerHTML = "Created: " + rslt["Date"];
    } 
    getReq.onerror = (err) => {
        console.warn(err);
    }
}

// get list of records from indexes of storages
function sortByIndex (ev) {
    console.log(ev.target.innerText);
    doors.dbStorNames().forEach(store => {
        let tx = makeTX(store, "readonly");
        tx.onsuccess = (ev) => {

        };
        switch (ev.target.innerText) {
            case "Design:": getDBData("design"); break;
            case "Decor:": getDBData("decor"); break;
            case "Glass:": getDBData("glass"); break;
            case "Lines:": getDBData("lines"); break;
            case "Decor Style:": getDBData("decorStyle"); break;
            case "Instock:": getDBData("instock"); break;
            default:
                break;
        }
    })

    
}


// 5) make bakup from DB, methid ADD
function bkupRetrieve() {
    let confReq = confirm("Do you really want to retrieve records from backup? The DB records will be rewritten!");
    if (confReq) {
        if (typeof bkup !== undefined) {  // at first, need to clear each STORE from records
            //console.log(bkup);
            doors.dbStorNames().forEach((tm) => {
                if (db.objectStoreNames.contains(tm)) {
                    let tx = makeTX(tm, "readwrite");
                    tx.onsuccess = (ev) => {console.log("Tx clear - Ok");};
                    let req = tx.objectStore(tm).clear();
                    req.onsuccess = (ev) => {
                        console.log("Store has been cleared. Ok");
                    }
                    req.onerror = (err) => {
                        console.warn(err);
                    }
                }
            });
            // passing data on from backup to DB
            bkup.forEach(obj => {
                let tx = makeTX(obj.TM.slice(3), "readwrite");
                tx.onsuccess = (ev) => {};
                let req = tx.objectStore(obj.TM.slice(3)).add(obj);
                req.onsuccess = (ev) => {
                    console.log("retrieve from backup - ok");
                }
                req.onerror = (err) => {
                    console.warn(err);
                }
            });
            getDBData("getAll");
        }

    } else return;



}

function makeTX (sorageName, txMode) {
    let tx = db.transaction(sorageName, txMode);
    return tx;
    tx.onerror = (err) => {
        console.warn(err);
    };
}

//=============================================================================================
// this creates unique IDs
function unID () {
    let crtTime = Date.now().toString(24).toUpperCase();
    let rndNum = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    rndNum = rndNum.toString(24).slice(0, 6).padStart(6, 0).toUpperCase();
    return "".concat(crtTime, "-", rndNum);
}