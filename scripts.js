const getAge = (name) => {
    return fetch(`https://tomsen.dev/FlowFormaAPI/getdate/${name}`).then(res => res.json());
}

const calculateAge = ({ Birth, Death }) => {
    const birth = new Date(Birth);
    const death = Death === null ? new Date() : new Date(Death);
    let age = death.getFullYear() - birth.getFullYear();
    let m = death.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

const fetchData = async () => {
    let table = document.querySelector("#table");
    let loading = document.querySelector(".loading");
    loading.style.display = 'block';
    let people = [];
    const [names, tech] = await Promise.all([
        fetch("https://tomsen.dev/FlowFormaAPI/names").then(res => res.json()),
        fetch("https://tomsen.dev/FlowFormaAPI/tech").then(res => res.json())
    ]);
    const ages = await Promise.all(names.map(name => getAge(name)));
    for (let i = 0; i < names.length; i++) {
        const age = calculateAge(ages[i]);
        people[i] = {
            name: names[i],
            tech: tech[i],
            age: age,
        };
    };
    for (let i = 0; i < people.length; i++) {
        let row = table.insertRow(i + 1);
        let name = row.insertCell(0);
        let tech = row.insertCell(1);
        let age = row.insertCell(2);
        name.innerHTML = people[i].name;
        tech.innerHTML = people[i].tech;
        age.innerHTML = people[i].age;
    }
    loading.style.display = 'none';
    table.style.display = 'table';
};

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

document.querySelectorAll('#table th').forEach(th => th.addEventListener('click', (() => {
    const table = document.querySelector("#table")
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr));
})));

fetchData();