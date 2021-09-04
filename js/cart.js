getCartPage();
renderItems();

let totalValue = 5;
setTimeout(() => { getUserInfo(getUserId()); }, 250);
setTimeout(() => { generateOrder(); }, 800);


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
            } else {
                alert("Acesso Negado!!!!!!!");
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
    console.log(product);
    let listItems = document.getElementById("items-to-display");
    if (!listItems)
        return;
    let htmlInsert = `
        <div class="products" id="${product.id}" price="${product.price}" qtd="${qtd}">
                <img src="../../images/doces.png">
                <h4>${product.name}</h4>
                <h4>Quantidade: ${qtd}</h4>
                <h4>R$${product.price},00</h4>
                <button class="removeProduct">
                <i class="fa fa-times-circle fa-2x"></i>
                </button>
        </div>
    `
    listItems.insertAdjacentHTML('beforeend', htmlInsert);
    removeProductCart();
}



function removeProductCart() {
    let productToRemove = Array.from(document.querySelectorAll(".removeProduct"));
    productToRemove.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let NodeRemove = elem.parentNode;
            if (NodeRemove.parentNode) {
                recalculateTotalValue(NodeRemove.getAttribute("price"), NodeRemove.getAttribute("qtd"));
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
    console.log(document.getElementById("user-info"))
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

const client = new Dato.SiteClient("d2e7727e16065b64a486255d82e999");


async function generateOrder() {
    document.getElementById("genOrders").onclick = function (e) {
        e.preventDefault();

        let ordersIds = [];
        let products = getAllProductsIds();

        async function createOrderItem(item) {

            try {
                const record = await client.items.create({
                    itemType: "972340", // model ID

                    productId: Number(item),
                    quantity: Number(localStorage.getItem(item))

                });

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
                });
                alert("Pedido efetuado com sucesso!!");
                getAllProductsIds().forEach(id => localStorage.removeItem(id));
                window.location.assign("welcome.html");
            } catch (error) {
                alert("Erro na criação do pedido!");
            }
        }
        createOrder();

        //remover os produtos do carrinho?
    }
}



