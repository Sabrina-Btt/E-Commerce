const client = new Dato.SiteClient("d2e7727e16065b64a486255d82e999");

document.getElementById("add-user").onclick = function (e) {
    e.preventDefault();

    let form = document.getElementById("user-info");
    
    async function createAddress() {
        try {
            const record = await client.items.create({
                itemType: "972324", // model ID

                street: form[2].value,
                district: form[4].value,
                number: form[3].value,
                city: form[5].value,
                zipCode: form[6].value               
               
            });

            return record.id;

        } catch (error) {
            alert("Erro na criação do endereço!");
        }
    }

    async function createUser() {
        try {
            const record = await client.items.create({
                itemType: "972319", // model ID

                fullName: form[0].value,
                email: form[7].value,
                phone: form[1].value,
                password: form[8].value,
                address: await createAddress(),
                isAdmin: false
            });

            alert("Cadastro efetuado com sucesso!");
            window.location.assign("login.html");
        } catch (error) {
            alert("Erro na criação do cadastro!");
        }
    }
    createUser();
}
