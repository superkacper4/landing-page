const submitButton = document.querySelector(".button")
const form = document.querySelector('form')
const inputs = document.querySelectorAll('input')

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var dataString = JSON.stringify(data),
            blob = new Blob([dataString], { type: "text/csv" }),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let formValue = Object.values(form).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {})

    inputs.forEach(input => {
        if (!input.checked && input.name === 'horns') {
            formValue = {
                ...formValue,
                horns: 'off'
            }
        }
        if (!input.checked && input.name === 'scales') {
            formValue = {
                ...formValue,
                scales: 'off'
            }
        }

    })


    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValue),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });


    const fields = ['nick', 'phone', 'email', 'number', 'file'];
    const opts = { fields };

    let csv

    try {
        csv = json2csv.parse(formValue, opts);
    } catch (err) {
        throw err
    }


    fileName = "form-data.csv";
    saveData(csv, fileName);
})