const jpdbBaseURL = "http://api.login2explore.com:5577"; // use http!
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const dbName = "SCHOOL-DB";
const relationName = "STUDENT-TABLE";
const connToken = "90934625|-31949212450574231|90956337"; // replace with your token

function getIdJson() {
  let roll = document.getElementById("roll").value;
  return JSON.stringify({ id: roll });
}

function fillData(data) {
  document.getElementById("name").value = data.name;
  document.getElementById("cls").value = data.cls;
  document.getElementById("bdate").value = data.bdate;
  document.getElementById("addr").value = data.addr;
  document.getElementById("edate").value = data.edate;
}

function getFormData() {
  let roll = document.getElementById("roll").value;
  let name = document.getElementById("name").value;
  let cls = document.getElementById("cls").value;
  let bdate = document.getElementById("bdate").value;
  let addr = document.getElementById("addr").value;
  let edate = document.getElementById("edate").value;

  return JSON.stringify({ id: roll, name, cls, bdate, addr, edate });
}

function resetForm() {
  document.getElementById("enrollForm").reset();
}

async function getRecord() {
  const getReq = {
    token: connToken,
    dbName: dbName,
    rel: relationName,
    cmd: "GET_BY_KEY",
    key: JSON.parse(getIdJson())
  };

  const res = await fetch(jpdbBaseURL + jpdbIRL, {
    method: "POST",
    body: JSON.stringify(getReq),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await res.json();

  if (result.data) {
    fillData(result.data.record);
  } else {
    resetForm();
    document.getElementById("roll").value = JSON.parse(getIdJson()).id;
  }
}

async function saveRecord() {
  const data = getFormData();

  const reqObj = {
    token: connToken,
    dbName: dbName,
    rel: relationName,
    cmd: "PUT",
    record: JSON.parse(data)
  };

  console.log("Submitting data:", reqObj);

  try {
    const res = await fetch(`${jpdbBaseURL}/api/iml`, {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    console.log("Save response:", result);

    if (result.status === 200) {
      alert(" Record saved/updated successfully!");
      resetForm();
    } else {
      alert(" Failed to save: " + JSON.stringify(result));
    }
  } catch (err) {
    alert(" Error while saving: " + err.message);
  }
}
