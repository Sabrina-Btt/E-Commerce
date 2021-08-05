let carrinho = [];
console.log(document.cookie)
getAllProductsDataBase();

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

function renderPage(products) {

    renderProducts(products);

    addToCart();

    incrementQuantityDisplay();

    decrementQuantityDisplay();
}

function renderProducts(products) {
    products.map(elem => {
        let listProduct = document.getElementById("top-3");

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
                let obj = {
                    id: currentId,
                    qtd: elem.parentElement.querySelector(".qtd-display").getAttribute("qtd"),
                }
                //carrinho.push(obj);
                let now = new Date();
                let expireCookie = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1);
                document.cookie = `${currentId}=${qtd};expires=${expireCookie}`;

            }
            document.getElementById('quantity').innerText = carrinho.length;
            //console.log(carrinho)
            console.log(document.cookie);
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

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}