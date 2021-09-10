getTypeFilter();

function getTypeFilter() {

    document.getElementById("filter").onclick = function (e) {
        e.preventDefault();
        let formulario = document.getElementById("formFilter");
        let form = [];
        for (let i = 0; i < formulario.length - 1; i++) {
            form.push(formulario[i]);
        }
        let tipos = form.filter(elem => elem.checked === true).map(elem => elem.id);
        if (tipos.length === 0) tipos = form.map(elem => elem.id);
        let type = "["
        tipos.forEach(elem => {
            type += `"${elem}",`
        });
        type += "]";
        getProductsDataBaseWithType(type);
    }
}

