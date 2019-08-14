var data =
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
        headers: {
            "X-API-Key": "truI0L1p5ykwDZWXPGTS3MSqMaLnoXaMCMoNg6Nj"
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        house(data.results[0].members);
    })
    .catch(function (error) {
        console.log(error);
    });


var data =
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
        headers: {
            "X-API-Key": "truI0L1p5ykwDZWXPGTS3MSqMaLnoXaMCMoNg6Nj"
        }
    })
    .then(function (response) {

        console.log(response);
        return response.json();
    })
    .then(function (data) {
        senate(data.results[0].members)
    })

function senate(data) {
    if (document.title.includes('senateAttendance')) {
        attendance(data);
        performance(data);
    } else if (document.title.includes('senateLoyality')) {
        performance(data);
        loyality(data);
    } else if (document.title.includes('senateStarter')) {
        dropDown(data);
        displayTable(data, null, "Find by State")
        document.addEventListener("change", function () {
            clickCapture(data);
        });
    }
}

function house(data) {
    if (document.title.includes('houseAttendance')) {
        attendance(data);
        performance(data);
    } else if (document.title.includes('houseloyality')) {
        performance(data);
        loyality(data);
    } else if (document.title.includes('houseStarter')) {
        dropDown(data);
        displayTable(data, null, "Find by State")
        document.addEventListener("change", function () {
            clickCapture(data);
        });
    }
}

function clickCapture(data) {
    var Table = document.getElementById("myTable");
    Table.innerHTML = " ";
    var dropdown = document.getElementById("mySelect");
    var dropdownVal = dropdown.value;
    var table = document.getElementById("myTable");
    table.innerHTML = " ";
    var checkboxes = document.getElementsByTagName("input");
    CheckedBoxesArray = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            CheckedBoxesArray.push(checkboxes[i].value);
        }
    }
    if (CheckedBoxesArray.length > 0) {
        displayTable(data, CheckedBoxesArray, dropdownVal);
    } else {
        displayTable(data, null, dropdownVal);
    }
}

function displayTable(data, CheckedBoxesArray, dropdownVal) {
    var len = data.length;
    var filterMembers = [];
    if (CheckedBoxesArray == null && dropdownVal == "Find by State") {
        filterMembers = data;
    } else if (CheckedBoxesArray == null) {
        for (var i = 0; i < len; i++) {
            if (data[i].state == dropdownVal) {
                filterMembers.push(data[i]);
            }
        }
    } else if (dropdownVal == "Find by State") {
        for (var i = 0; i < len; i++) {
            if (CheckedBoxesArray.includes(data[i].party)) {
                filterMembers.push(data[i]);
            }
        }
    } else {
        for (var i = 0; i < len; i++) {
            if (CheckedBoxesArray.includes(data[i].party) && data[i].state == dropdownVal) {
                filterMembers.push(data[i]);
            }
        }
    }
    printheader();
    for (var i = 0; i < filterMembers.length; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        tr.appendChild(td);
        var a = document.createElement("a");
        td.appendChild(a);
        a.href = "filteredMembers[i].url";
        var val = document.createTextNode(filterMembers[i].first_name + " " + " " + filterMembers[i].last_name);
        a.appendChild(val);
        var td = document.createElement("td");
        tr.appendChild(td);
        var val = document.createTextNode(filterMembers[i].party);
        td.appendChild(val);
        var td = document.createElement("td");
        tr.appendChild(td);
        var val = document.createTextNode(filterMembers[i].state);
        td.appendChild(val);
        var td = document.createElement("td");
        tr.appendChild(td);
        var val = document.createTextNode(filterMembers[i].seniority);
        td.appendChild(val);
        var td = document.createElement("td");
        tr.appendChild(td);
        var val = document.createTextNode(filterMembers[i].votes_with_party_pct + "%");
        td.appendChild(val);

        document.getElementById("myTable").appendChild(tr);
    }
}

function printheader() {
    var th = document.createElement("thead");
    var tr = document.createElement("tr");
    th.appendChild(tr);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode("Full Name");
    td.appendChild(val);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode("Party");
    td.appendChild(val);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode("State");
    td.appendChild(val);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode("Seniority");
    td.appendChild(val);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode("Vote Share");
    td.appendChild(val);
    document.getElementById("myTable").appendChild(th);
}

function dropDown(data) {
    var dropDownArry = [];
    var len = data.length;
    var dropDown = [];
    for (i = 0; i < len; i++) {
        dropDown.push(data[i].state);
    }
    dropDown.sort();
    var dropDownlist = findUniq(dropDown);
    dropDownlist.sort();
    var ts = document.createElement("Select");
    for (var i = 0; i < dropDownlist.length; i++) {
        var to = document.createElement("option");
        ts.appendChild(to);
        var val = document.createTextNode(dropDownlist[i]);
        to.appendChild(val);
        document.getElementById("mySelect").appendChild(to);
    }
    var to = document.createElement("option");
    ts.appendChild(to);
    var val = document.createTextNode('Find by State');
    to.appendChild(val);
    document.getElementById("mySelect").appendChild(to);
}

function findUniq(recArr) {
    var len = recArr.length;
    var uniqArr = [];
    uniqArr.push(recArr[0]);
    var found = false;
    for (var i = 1; i < len; i++) {
        found = false;
        for (var j = 0; j < uniqArr.length; j++) {
            if (uniqArr[j] == recArr[i]) {
                found = true;
            }
        }
        if (found == false) {
            uniqArr.push(recArr[i]);
        }
    }
    return uniqArr;
}

function attendance(data) {
    var missedVotes = [];
    var len = data.length;
    for (var i = 0; i < len; i++) {
        missedVotes.push(data[i].missed_votes);
    }
    missedVotes.sort(sortNumber);
    missedVotes = findUniq(missedVotes);
    var tenpec = len / 10 | 0;

    for (var j = 0; j < 10; j++) {
        for (var i = 0; i < len; i++) {
            if (data[i].missed_votes == missedVotes[j]) {
                printTable(data[i].first_name + " " + data[i].last_name, data[i].missed_votes, data[i].missed_votes_pct, "lEtable");
            }
        }
    }
    for (var j = missedVotes.length; j > missedVotes.length - 10; j--) {
        for (var i = 0; i < len - 1; i++) {
            if (data[i].missed_votes == missedVotes[j]) {
                printTable(data[i].first_name + " " + data[i].last_name, data[i].missed_votes, data[i].missed_votes_pct, "mEtable");
            }
        }
    }
}

function printTable(celval1, celval2, celval3, tableName) {

    var tr = document.createElement("tr");
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode(celval1);
    td.appendChild(val);
    tr.appendChild(td);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode(celval2);
    td.appendChild(val);
    var td = document.createElement("td");
    tr.appendChild(td);
    var val = document.createTextNode(celval3);
    td.appendChild(val);
    document.getElementById(tableName).appendChild(tr);
}

function sortNumber(a, b) {
    return a - b;
}

function performance(data) {
    var len = data.length;
    var rcount = 0;
    var dcount = 0;
    var icount = 0;
    var rsum = 0;
    var dsum = 0;
    var isum = 0;
    for (var i = 0; i < len; i++) {
        if (data[i].party == "R") {
            rcount = rcount + 1;
            rsum = rsum + data[i].total_votes;
        } else if (data[i].party == "D") {
            dcount = dcount + 1;
            dsum = rsum + data[i].total_votes;
        } else if (data[i].party == "I") {
            icount = icount + 1;
            isum = rsum + data[i].total_votes;
        }
    }
    var total = rsum + dsum + isum;
    var rpec = rsum / total * 100 | 0;
    var dpec = dsum / total * 100 | 0;
    var ipec = isum / total * 100 | 0;
    var repsRep = document.getElementById('rc');
    repsRep.innerHTML = rcount;
    var repsRep = document.getElementById('dc');
    repsRep.innerHTML = dcount;
    var repsRep = document.getElementById('ic');
    repsRep.innerHTML = icount;
    var repsRep = document.getElementById('rp');
    repsRep.innerHTML = rpec;
    var repsRep = document.getElementById('dp');
    repsRep.innerHTML = dpec;
    var repsRep = document.getElementById('ip');
    repsRep.innerHTML = ipec;
}

function loyality(data) {
    var totalVotes = [];
    var len = data.length;
    for (var i = 0; i < len; i++) {
        totalVotes.push(data[i].total_votes);
    }
    totalVotes.sort(sortNumber);
    totalVotes = findUniq(totalVotes);
    var tenpec = len / 10 | 0;

    for (var j = 0; j < 10; j++) {
        for (var i = 0; i < len; i++) {
            if (data[i].total_votes == totalVotes[j]) {
                printTable(data[i].first_name + " " + data[i].first_name, data[i].total_votes, data[i].votes_with_party_pct, "lLtable");
            }
        }
    }
    for (var j = totalVotes.length; j > totalVotes.length - 10; j--) {
        for (var i = 0; i < len - 1; i++) {
            if (data[i].total_votes == totalVotes[j]) {
                printTable(data[i].first_name + " " + data[i].first_name, data[i].total_votes, data[i].votes_with_party_pct, "mLtable");
            }
        }
    }
}
