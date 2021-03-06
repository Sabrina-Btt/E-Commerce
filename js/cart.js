const client = new Dato.SiteClient("d2e7727e16065b64a486255d82e999");
getCartPage();
renderItems();

let totalValue = 5;
setTimeout(() => { getUserInfo(getUserId()); }, 250);
setTimeout(() => { generateOrder(); }, 3000);

//Função que checa tamanho de produtos no carrinho e renderiza a main dependendo da quantidade
function getCartPage() {
    if (getAllProductsIds().length === 0) {
        fetch("../components/cart.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector("main").innerHTML = data;
            })
            .then(() => {
                document.querySelector("head").insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="../../css/cart/cart.css"></link>');
            });
    } else {
        fetch("../components/cartItems.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector("main").innerHTML = data;
            })
            .then(() => {
                document.querySelector("head").insertAdjacentHTML('afterbegin', '<link rel="stylesheet" href="../../css/cart/cartItems.css"></link>');
            });
    }
}

//Função que renderiza os produtos na pagina do carrinho.
function renderItems() {
    let cartProducts = getAllProductsIds();
    localStorage.removeItem("productsInCart");
    cartProducts.map(id => {
        getCartProductsBd(id, localStorage.getItem(id));
    })

}
//Função para pegar os produtos do banco de dados
function getCartProductsBd(id, qtd) {
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
                    allProducts(
                      filter: {
                        id: { eq: "${id}" }
                      }
                    ) {
                      name 
                      price
                      id
                      image{
                        url
                      }
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allProducts.length !== 0) {

                renderProductsCart(res.data.allProducts[0], qtd);
                setTotalValue(res.data.allProducts[0], qtd);
            }
        })
        .catch((error) => {
            console.log(error);
        });

}

//Função para renderizar os produtos que estão no carrinho
function renderProductsCart(product, qtd) {
    if (!product)
        return;

    let listItems = document.getElementById("items-to-display");
    if (!listItems)
        return;
    let htmlInsert = `
        <div class="products" id="${product.id}" price="${product.price}" qtd="${qtd}">
                <img src="${product.image.url}">
                <h4 id="pName">${product.name}</h4>
                <h4>Quantidade: ${qtd}</h4>
                <h4>R$${product.price},00</h4>
                <button class="removeProduct">
                <i class="fa fa-times-circle fa-2x"></i>
                </button>
        </div>
    `
    let nameItem = JSON.parse(localStorage.getItem("productsInCart"));
    nameItem = nameItem === null ? [] : nameItem;
    if (!nameItem.some(elem => elem === product.name)) {
        nameItem.push(product.name.trim());
        localStorage.setItem("productsInCart", JSON.stringify(nameItem));
    }
    listItems.insertAdjacentHTML('beforeend', htmlInsert);
    removeProductCart();
}



function removeProductCart() {
    let productToRemove = Array.from(document.querySelectorAll(".removeProduct"));
    productToRemove.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let NodeRemove = elem.parentNode;
            let productName = elem.parentNode.textContent.split("\n")[2].trim();
            if (NodeRemove.parentNode) {
                recalculateTotalValue(NodeRemove.getAttribute("price"), NodeRemove.getAttribute("qtd"));
                let nameItem = JSON.parse(localStorage.getItem("productsInCart"));
                nameItem.splice(nameItem.indexOf(productName), 1);
                localStorage.setItem("productsInCart", JSON.stringify(nameItem));
                localStorage.removeItem(`${NodeRemove.id}`);
                NodeRemove.parentNode.removeChild(NodeRemove);
                setQuantityCart()
                if (getAllProductsIds().length === 0) {
                    getCartPage();
                }
            }
        }
    })
}

function recalculateTotalValue(price, qtd) {
    totalValue -= Number(price) * qtd;
    document.getElementById("totalCartValue").innerHTML = ` Valor Total: R$${totalValue},00 `;

}

function setTotalValue(products, qtd) {
    totalValue += Number(products.price) * qtd;
}

function renderTotalValue() {
    let displayTotalValue = document.getElementById("user-info");
    let htmlInsert = `
        <h3>Dados do Pedido</h3>
            
        <p>Taxa de entrega: R$5,00</p>
        <p id="totalCartValue">Valor Total: R$${totalValue},00 </p>

        <h3>Para finalizar o pedido efetue o login </h3>
        <button id="login-cart" class="text-button">
            Entrar
        </button>
    `
    displayTotalValue.insertAdjacentHTML('afterbegin', htmlInsert)
}

function redirectToLogin() {
    document.getElementById("login-cart").onclick = function (e) {
        window.location.assign("login.html");
    }
}

function renderUserInfo(userinfo) {
    if (!userinfo)
        return;
    let displayUserInfo = document.getElementById("user-info");

    if (!displayUserInfo)
        return;
    let htmlInsert = `
        <h3>Dados de Entrega</h3>
        <p>
            Nome: ${userinfo.fullName}
            <br>
            <br>
            Endereço de entrega: ${userinfo.address.street}, ${userinfo.address.number}, ${userinfo.address.city}
            <br>
            <br>
            Telefone: ${userinfo.phone}
        </p>
        <h3>Dados do Pedido</h3>
            
        <p>Taxa de entrega: R$5,00</p>
        <p id="totalCartValue">Valor Total: R$${totalValue},00 </p>
        <button id="genOrders" class="text-button">
            Finalizar Pedido
        </button>

    `
    displayUserInfo.insertAdjacentHTML('afterbegin', htmlInsert)
}

function getUserInfo(id) {
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
                renderUserInfo(res.data.allUsers[0])
            } else {
                alert("Acesso Negado!!!!!!!");
            }
        })
        .catch((error) => {
            renderTotalValue();
            redirectToLogin();
        });
}

async function generateOrder() {
    document.getElementById("genOrders").onclick = function (e) {
        e.preventDefault();
        validateQuantityInStock();
        let ordersIds = [];


        async function validateQuantityInStock() {
            let vectorIds = getAllProductsIds();
            let ids = "["
            vectorIds.forEach(elem => {
                ids += `"${elem}",`
            });
            ids += "]";

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
                            allProducts(filter: {id: {in: ${ids}}}) {
                                inStock
                                id
                                name
                            }
                        }`
                    }),
                }
            )
                .then(res => res.json())
                .then((res) => {
                    let currentQtdInStock = res.data.allProducts.map(elem => elem.inStock);
                    let productsName = res.data.allProducts.map(elem => elem.name);
                    let productsIds = res.data.allProducts.map(elem => elem.id);

                    let qtdInStock = currentQtdInStock.map(elem => elem - Number(localStorage.getItem(vectorIds[currentQtdInStock.indexOf(elem)])));

                    if (!qtdInStock.some(elem => elem < 0)) {
                        if(qtdInStock.some(elem => elem == 0)){
                            let index = qtdInStock.indexOf(qtdInStock.find(elem => elem === 0));
                            
                            client.items.destroy(productsIds[index])
                            .then((item) => {
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                            qtdInStock.splice(index, 1);
                            productsName.splice(index, 1);
                            productsIds.splice(index, 1);
                            
                        }
                        alert("Checando estoque!");
                        attStockInDb(productsIds, qtdInStock);
                    } else {
                        let noStock = qtdInStock.find(elem => elem < 0);

                        alert(`A quantidade desejada do produto ${productsName[qtdInStock.indexOf(noStock)]} não está mais disponivel` +
                            `, temos ${currentQtdInStock[qtdInStock.indexOf(noStock)]}` +
                            ` produtos no estoque, favor, remover elemento e reajustar a quantidade desejada.`);
                    }
                })
                .catch((error) => {
                    alert("Deu ruim!!!!!!!");
                });

        }

        async function attStockInDb(ids, quantities) {
            for (const itemId of ids) {
                client.items
                    .update(itemId, {
                        in_stock: Number(quantities[ids.indexOf(itemId)]),
                    })
                    .then((item) => {
                        console.log(item);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            createOrder();
        }

        async function createOrderItem(item) {

            try {
                const record = await client.items.create({
                    itemType: "972340", // model ID

                    productId: Number(item),
                    quantity: Number(localStorage.getItem(item)),
                    productname: JSON.parse(localStorage.getItem("productsInCart"))[0]
                });

                let nameItem = JSON.parse(localStorage.getItem("productsInCart"));
                nameItem.shift();
                localStorage.setItem("productsInCart", JSON.stringify(nameItem));
                return record.id;
            } catch (error) {
                alert("Erro na criação do pedido!");
            }
        }

        async function createOrder() {
            try {
                alert("Registrando pedido!!");
                for (const item of getAllProductsIds()) {
                    const id = await createOrderItem(item);
                    ordersIds.push(id);
                };

                const record = await client.items.create({
                    itemType: "972326", // model ID

                    userId: Number(localStorage.getItem("userId")),
                    totalPrice: parseFloat(totalValue),
                    orderItems: ordersIds,
                    username: localStorage.getItem("userName"),
                    user_phone: localStorage.getItem("userPhone"),
                    user_address: localStorage.getItem("userAddress"),
                });
                alert("Pedido efetuado com sucesso!!");
                getAllProductsIds().forEach(id => localStorage.removeItem(id));
                window.location.assign("welcome.html");
            } catch (error) {
                alert("Erro na criação do pedido!");
            }
        }

    }
}



