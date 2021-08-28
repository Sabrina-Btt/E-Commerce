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

    getUserIdFromCookie();

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
    return getCookieAllProducts().length;
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
                let now = new Date();
                let expireCookie = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 20);
                document.cookie = `${currentId}=${qtd};expires=${expireCookie}`;
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
function getCookieAllProducts() {
    let products = document.cookie.split(';');
    let ids = [];
    let qtd = [];
    let vec = [];

    ids = products.map(elem => {
        let key = elem.split('=')[0].trim();
        if (key !== "userId")
            return key;
    });

    qtd = products.map(elem => {
        let key = elem.split('=')[0].trim();
        if (key !== "userId") {
            return elem.split('=')[1];
        }
    });
    ids = ids.filter(elem => elem !== undefined)
    qtd = qtd.filter(elem => elem !== undefined)

    if (ids[0] !== '') {
        for (let i = 0; i < ids.length; i++) {
            vec.push([ids[i], qtd[i]]);
        }
    }
    return vec;
}

//---------------------------------------------- Login ---------------------------------------------------------------------------------//
//Função utilizada para pegar o id do usuario logado
function getUserIdFromCookie() {
    let cookieList = document.cookie.split(';');
    let userID = null;
    cookieList.forEach(elem => {
        let object = elem.split('=');
        let key = object[0].trim();
        if (key == "userId")
            userID = object[1].trim();
    });
    return userID;
}


function getLoginPage(){
    document.getElementById("login-icon").onclick = function (e) {   
        if(getUserIdFromCookie() !== null)
            window.location.assign("welcome.html")
        else
            window.location.assign("login.html")

    }    
}