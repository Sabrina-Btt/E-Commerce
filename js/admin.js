const client = new Dato.SiteClient("d2e7727e16065b64a486255d82e999");

document.getElementById("add-product").onclick = function (e) {
    e.preventDefault();

    let form = document.getElementById("addProduct");

    async function createRecord() {
        try {
            const record = await client.items.create({
                itemType: "972342", // model ID

                inStock: form[4].value,
                price: form[2].value,
                name: form[0].value,
                category: form[3].value,
                description: form[1].value

            });

            alert("Produto criado com sucesso!");
        } catch (error) {
            alert("Erro na criação do produto!");
        }
    }
    createRecord();
}



