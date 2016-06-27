"use strict";

//Example, compared to https://lecture-demo.ira.uka.de/levenshtein-demo/
// const med = determineMED(["G", "o", "o", "g", "l", "e"], ["F", "a", "c", "e", "b", "o", "o", "k"], {
//     replace: 1,
//     insert: 1, 
//     delete: 1
// });

const REFERENZ = "wenn es im Juni viel donnert kommt ein trüber Sommer";
const HYP_1 = "im Juni viel Sonne kommt ein trübenen Sommer";
const HYP_2 = "viel Donner im Juni einen trüben Sommer bringt";
const HYP_3 = "Juni Donner einen Sommer";
const HYP_4 = "im Juni viel Donner bringt einen trüben Sommer";
const HYP_5 = "wenns im Juno viel Donner gibts einen trüben Sommer";

console.log("4a 1: ", determineMED(REFERENZ.split(" "), HYP_1.split(" ")));
console.log("4a 2: ", determineMED(REFERENZ.split(" "), HYP_2.split(" ")));
console.log("4a 3: ", determineMED(REFERENZ.split(" "), HYP_3.split(" ")));
console.log("4a 4: ", determineMED(REFERENZ.split(" "), HYP_4.split(" ")));
console.log("4a 5: ", determineMED(REFERENZ.split(" "), HYP_5.split(" ")));

console.log();
console.log("4b 1: ", determineMED(REFERENZ.split(""), HYP_1.split("")));
console.log("4b 2: ", determineMED(REFERENZ.split(""), HYP_2.split("")));
console.log("4b 3: ", determineMED(REFERENZ.split(""), HYP_3.split("")));
console.log("4b 4: ", determineMED(REFERENZ.split(""), HYP_4.split("")));
console.log("4b 5: ", determineMED(REFERENZ.split(""), HYP_5.split("")));

console.log();
console.log("4c 1: ", determineMED(REFERENZ.split(" "), HYP_1.split(" "), {
    replace: 2,
    insert: 1,
    delete: 1
}));
console.log("4c 2: ", determineMED(REFERENZ.split(" "), HYP_2.split(" "), {
    replace: 2,
    insert: 1,
    delete: 1
}));
console.log("4c 3: ", determineMED(REFERENZ.split(" "), HYP_3.split(" "), {
    replace: 2,
    insert: 1,
    delete: 1
}));
console.log("4c 4: ", determineMED(REFERENZ.split(" "), HYP_4.split(" "), {
    replace: 2,
    insert: 1,
    delete: 1
}));
console.log("4c 5: ", determineMED(REFERENZ.split(" "), HYP_5.split(" "), {
    replace: 2,
    insert: 1,
    delete: 1
}));

function determineMED(s1, s2, penalties) {
    if (typeof penalties != "object") {
        penalties = {
            replace: 1,
            insert: 1,
            delete: 1
        };
    }

    const tbl = initTable();
    // printTable(tbl, s1, s2);

    for (let i = 1; i < tbl.length; i++) {
        computeRow(tbl, i);
    }
    printTable(tbl, s1, s2);

    return tbl[s1.length][s2.length];

    function computeRow(tbl, i) {
        for (let j = 1; j < tbl[0].length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                tbl[i][j] = [tbl[i - 1][j - 1][0], {
                    r: i - 1,
                    c: j - 1
                }];
                continue;
            }

            let previous = {r: i - 1, c: j} ; //assume l, we override it when not (exclusively) true
            const t = tbl[i - 1][j][0];
            const tl = tbl[i - 1][j - 1][0];
            const l = tbl[i][j - 1][0];

            const value = Math.min(tbl[i - 1][j][0], tbl[i - 1][j - 1][0], tbl[i][j - 1][0]) + 1;
            
            if (t <= tl && t <= l) {
                previous = {r: i - 1, c: j};
            }
            else if (tl <= t && tl <= l) {
                previous = {r: i - 1, c: j - 1};
            }

            tbl[i][j] = [value, previous];
        }
    }

    function initTable() {
        const tbl = [];

        for (let i = 0; i < s1.length + 1; i++) {
            tbl.push([]);
        }

        for (let i = 0; i < s1.length + 1; i++) {
            tbl[i][0] = [i, {r: -1, c: -1}];
        }

        for (let i = 0; i < s2.length + 1; i++) {
            tbl[0][i] = [i, {r: -1, c: -1}];
        }

        return tbl;
    }
}

function computeTrace(tbl) {
    
}

function printTable(tbl, s1, s2) {
    s1 = clone(s1);
    s2 = clone(s2);
    const copy = clone(tbl);

    copy[0].unshift("");
    for (let i = 0; i < s1.length; i++) {
        copy[i + 1].unshift(s1[i]);
    }

    if (Array.isArray(s2)) {
        s2.unshift("");
        s2.unshift("");
    }
    else {
        s2 = "  " + s2;
    }
    copy.unshift([]);
    for (let i = 0; i < s2.length; i++) {
        copy[0][i] = s2[i];
    }

    copy.forEach(row => {
        const rowStr = row.reduce((prev, curr) => {
            return prev + ((typeof curr == "object") ? curr[0] + ";" + curr[1].r + "|" + curr[1].c : curr) + "\t";
        }, "");

        console.log(rowStr);
    });
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}