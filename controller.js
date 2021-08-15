//---------------------------------------------- Cart ---------------------------------------------------------------------------------//
console.log(document.cookie);
let carrinho = [];

getAllProductsDataBase();

function renderPage(products) {

    renderProducts(products);

    addToCart();

    setQuantityCart();

    incrementQuantityDisplay();

    decrementQuantityDisplay();

    getUserIdFromCookie();
}

//Funções Auxiliares
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

function renderProducts(products) {
    products.map(elem => {
        let listProduct = document.getElementById("featured");
        if (!listProduct)
            return;
        let htmlInsert = `
            <div class="product">
                <img src="./images/logo.png" alt="">
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

function setQuantityCart() {
    document.getElementById('quantityCart').innerText = getQuantityCart() !== 0 ? getQuantityCart() : '';
}

function getQuantityCart() {
    return getInformationCookie()[0].length;
}

function addToCart() {
    let teste = Array.from(document.querySelectorAll(".add"));
    teste.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();

            let currentId = elem.getAttribute('productId');
            let ProductFound = carrinho.find(prod => prod.id === currentId);
            let qtd = elem.parentElement.querySelector(".qtd-display").getAttribute("qtd");

            if (ProductFound !== undefined) {
                ProductFound.qtd = elem.parentElement.querySelector(".qtd-display").getAttribute("qtd");
            } else {
                // let obj = {
                //     id: currentId,
                //     qtd: elem.parentElement.querySelector(".qtd-display").getAttribute("qtd"),
                // }
                //carrinho.push(obj);
                let now = new Date();
                let expireCookie = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 20);
                document.cookie = `${currentId}=${qtd};expires=${expireCookie}`;
            }
            setQuantityCart();
        }
    });

}


function incrementQuantityDisplay() {
    let teste = Array.from(document.querySelectorAll(".plus"));
    teste.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();
            let htmlDisplay = elem.previousElementSibling;
            let res = Number(htmlDisplay.getAttribute("qtd")) + 1;
            htmlDisplay.innerHTML = res;
            htmlDisplay.setAttribute("qtd", res);
        }
    })
}

function decrementQuantityDisplay() {
    let teste = Array.from(document.querySelectorAll(".minus"));
    teste.map(elem => {
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

function getInformationCookie() {
    let products = document.cookie.split(';');
    let ids = products.map(elem => {
        let key = elem.split('=')[0].trim();
        if(key!=="userId")
            return key;
    });
    let qtd = products.map(elem => elem.split('=')[1]);
    if (ids[0] === "")
        ids = [];
    let informations = [ids, qtd];
    return informations;
}

function getCookieIdQtd(){
    let products = document.cookie.split(';');
    let ids = products.map(elem => {
        let key = elem.split('=')[0].trim();
        if(key!=="userId")
            return key;
    });
    let qtd = products.map(elem => elem.split('=')[1]);
    let vec = [];
    if (ids[0] === "")
        ids = [];
    for(let i=0; i<ids.length; i++){
        vec.push([ids[i],qtd[i]]);
    }
    return vec;
}

//---------------------------------------------- Login ---------------------------------------------------------------------------------//

function getUserIdFromCookie(){
    let cookieList = document.cookie.split(';');
    let userID = null;
    cookieList.forEach(elem => {
        let object = elem.split('='); 
        let key = object[0].trim();
        if(key=="userId")
            userID = object[1].trim();
    });
    return userID;
}