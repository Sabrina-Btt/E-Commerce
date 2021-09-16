setQuantityCart();
setTimeout(() => { getUserRegister(getUserId()) }, 200)
setTimeout(() => { getUserOrders(getUserId()) }, 200)

function getUserRegister(id) {
    if (!id)
        return;
    const token = 'd2e7727e16065b64a486255d82e999';
    fetch(
        'https://graphql.datocms.com/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({
                query: `
                {
                    allUsers(filter: {id: {eq: ${id}}}) {
                        email
                        phone
                        fullName
                        address {
                          street
                          number
                          city
                          district
                        }
                      }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allUsers.length !== 0) {
                renderUserRegister(res.data.allUsers[0])
            } else {
                alert("Acesso Negado!!!!!!!");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}




function renderUserRegister(userinfo) {
    let displayUserName = document.getElementById("welcome");
    let nameInsert = `
        <h2>Seja bem vindo(a), ${userinfo.fullName}!</h2>
    `
    displayUserName.insertAdjacentHTML('afterbegin', nameInsert)

    let displayUserInfo = document.getElementById("info");
    if (!displayUserInfo)
        return;
    let htmlInsert = `
    
    <h4>Infomações Pessoais</h4>
    <p>
        Nome: ${userinfo.fullName}
        <br>
        Email: ${userinfo.email}
        <br>
        Telefone: ${userinfo.phone}
        <br>
    </p>

    <hr>

    <h4>Endereço de Entrega</h4>
    <p>
        ${userinfo.address.street}, ${userinfo.address.number}
        <br>
        ${userinfo.address.district}, ${userinfo.address.city}.
    </p>  

    `
    displayUserInfo.insertAdjacentHTML('beforeend', htmlInsert)
}

function getUserOrders(id) {
    const token = 'd2e7727e16065b64a486255d82e999';
    fetch(
        'https://graphql.datocms.com/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({
                query: `
                {
                    allOrders(filter: {userId: {eq: ${id}}}) {
                        id
                        totalPrice
                        orderItems {
                          productname
                          quantity
                        }
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allOrders.length !== 0) {
                renderUserOrders(res.data.allOrders)
            } else {
                renderOrdersCard();
            }
        })
        .catch((error) => {
            console.log(error);
        });

}

function renderUserOrders(orders) {
    for (const elem of orders) {
        let listOrder = document.getElementById("orders");

        let htmlInsert = `
            <h3>Pedido número ${elem.id}</h3>
            <h4>Produtos:</h4>
        `
        for (const item of elem.orderItems) {
            htmlInsert += `<p>Nome: ${item.productname}  Quantidade: ${item.quantity}</p>`

        }

        htmlInsert += `<p>Valor Total: R$${elem.totalPrice},00</p>`

        listOrder.insertAdjacentHTML('beforeend', htmlInsert)
    }


}

function renderOrdersCard() {
    let display = document.getElementById("orders");

    let htmlInsert = `
        Nenhum pedido ativo, mas que tal conferir nossas delícias?
        <button class="text-button">
            Confira!
        </button>
    `
    display.insertAdjacentHTML('beforeend', htmlInsert);

}