//---------------------------------------------- Cart ---------------------------------------------------------------------------------//
let carrinho = [];

getAllProductsDataBase();

//Função usada para renderizar a pagina
function renderPage(products) {
    products = products.slice(0, 3);
    renderProducts(products);

    addToCart();

    setQuantityCart();

    incrementQuantityDisplay();

    decrementQuantityDisplay();

    getUserId();

    getLoginPage();

}

//Funções Auxiliares // Pega todos os produtos do banco de dados 
function getAllProductsDataBase() {
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
                    allProducts {
                        inStock
                        name
                        price
                        description
                        id
                      }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allProducts.length !== 0) {
                renderPage(res.data.allProducts);
            } else {
                alert("Query Error! Could not get products from database!");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

//Renderiza os produtos que pegamos do banco de dados
function renderProducts(products) {
    if (!products)
        return;
    products.map(elem => {
        let listProduct = document.getElementById("featured");
        if (!listProduct)
            return;
        let htmlInsert = `
            <div class="product">
                <img src="../images/logo.png" alt="">
                <h2>${elem.name}</h2>

                <span>${elem.description}</span>

                <span>Preço: R$${Number(elem.price).toFixed(2)} </span>

                <div class="buttons">
                    <div class="quantity-button">
                        <button class="minus">
                            -
                        </button>
                        <span class="qtd-display" qtd=1>1</span>
                        <button class="plus">
                            +
                        </button>
                    </div>
                    <button class="add" productId=${elem.id}>
                        Adicionar
                    </button>
                </div>
            </div>
        `
        listProduct.insertAdjacentHTML('beforeend', htmlInsert)
    })
}

//Redefine a quantidade de produtos no carrinho
function setQuantityCart() {
    document.getElementById('quantityCart').innerText = getQuantityCart() !== 0 ? getQuantityCart() : '';
}

//Pega a quantidade de produtos no carrinho
function getQuantityCart() {
    return getAllProductsIds().length;
}

//Função que adiciona o produto selecionado ao carrinho
function addToCart() {
    let add = Array.from(document.querySelectorAll(".add"));
    add.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();

            let currentId = elem.getAttribute('productId');
            let ProductFound = carrinho.find(prod => prod.id === currentId);
            let qtd = elem.parentElement.querySelector(".qtd-display").getAttribute("qtd");

            if (ProductFound !== undefined) {
                ProductFound.qtd = elem.parentElement.querySelector(".qtd-display").getAttribute("qtd");
            } else {
                localStorage.setItem(`${currentId}`, `${qtd}`);
            }
            setQuantityCart();
        }
    });

}

//Função para incrementar a quantidade no display do produto
function incrementQuantityDisplay() {
    let displayIncrement = Array.from(document.querySelectorAll(".plus"));
    displayIncrement.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let htmlDisplay = elem.previousElementSibling;
            let res = Number(htmlDisplay.getAttribute("qtd")) + 1;
            htmlDisplay.innerHTML = res;
            htmlDisplay.setAttribute("qtd", res);
        }
    })
}

//Função para decrementar a quantidade no display do produto
function decrementQuantityDisplay() {
    let displayDecrement = Array.from(document.querySelectorAll(".minus"));
    displayDecrement.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let htmlDisplay = elem.nextElementSibling;
            let res = Number(htmlDisplay.getAttribute("qtd")) - 1;
            if (res < 1) {
                res = 1;
            }
            htmlDisplay.innerHTML = res;
            htmlDisplay.setAttribute("qtd", res);
        }
    })
}

//Função para pegar somente os produtos do cookie
function getAllProductsIds() {
    let keys = Object.keys(localStorage);
    keys = keys.filter(elem => elem !== "userId");
    return keys;
}

//---------------------------------------------- Login ---------------------------------------------------------------------------------//
//Função utilizada para pegar o id do usuario logado
function getUserId() {
    return localStorage.getItem("userId");
}


function getLoginPage() {
    document.getElementById("login-icon").onclick = function (e) {
        if (getUserId() !== null)
            window.location.assign("welcome.html")
        else
            window.location.assign("login.html")

    }
}