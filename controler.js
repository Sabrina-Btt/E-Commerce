let carrinho = [];
console.log(getInfomationCookie(document.cookie))

getAllProductsDataBase();


function renderPage(products) {

    renderProducts(products);

    addToCart();

    setQuantityCart();

    incrementQuantityDisplay();

    decrementQuantityDisplay();
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
                alert("Error!");
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

                <span>${elem.description} </span>

                <span>Preço : ${elem.price} </span>

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
    document.getElementById('quantityCart').innerText = getInfomationCookie(document.cookie)[0].length !== 0 ? getInfomationCookie(document.cookie)[0].length : '';
}

function getQuantityCart() {
    return getInfomationCookie(document.cookie)[0].length;
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
                let expireCookie = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 5);
                document.cookie = `${currentId}=${qtd};expires=${expireCookie}`;

            }
            setQuantityCart();
            console.log(getInfomationCookie(document.cookie)[0].length);
            //console.log(carrinho)
            // console.log(document.cookie);
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

function getInfomationCookie(stringCookie) {
    let products = stringCookie.split(';');
    let ids = products.map(elem => elem.split('=')[0]);
    let qtd = products.map(elem => elem.split('=')[1]);
    if (ids[0] === "")
        ids = [];
    let informations = [ids, qtd];
    return informations;
}
//---------------------------------------------- Cart ---------------------------------------------------------------------------------//
