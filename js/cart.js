getCartPage();
renderItems();
// getUserInfo(getUserIdFromCookie());

let totalValue = 5;
setTimeout(() => { getUserInfo(getUserIdFromCookie()); }, 250);


//Função que checa tamanho de produtos no carrinho e renderiza a main dependendo da quantidade
function getCartPage() {
    if (getCookieAllProducts().length === 0) {
        fetch("../routes/cart.html")
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
    let cartProducts = getCookieAllProducts();

    cartProducts.map(infoProd => {
        getCartProductsBd(infoProd[0], infoProd[1]);
    })

}
//Função para pegar os produtos do banco de dados
function getCartProductsBd(id, qtd) {
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

    console.log(product);
    let listItems = document.getElementById("items-to-display");
    if (!listItems)
        return;
    let htmlInsert = `
        <div class="products" id="${product.id}">
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
    console.log(productToRemove);
    productToRemove.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let NodeRemove = elem.parentNode;
            if (NodeRemove.parentNode) {
                document.cookie = `${NodeRemove.id}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
                NodeRemove.parentNode.removeChild(NodeRemove);
                if (getCookieAllProducts().length === 0) {
                    getCartPage();
                } else {
                    getUserInfo(getUserIdFromCookie());
                }
            }
        }
    })
}

function setTotalValue(products, qtd) {
    totalValue += Number(products.price) * qtd;
}

function renderUserInfo(userinfo) {
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
        <p>
            Taxa de entrega: R$5,00
            <br>
            Valor Total: R$${totalValue},00 
        </p>
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
            console.log(error);
        });
}