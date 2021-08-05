let carrinho = [];

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
                //console.log(res.data.allProducts);
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
                        <span id="qtd-display" qtd=1>1</span>
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

            if (ProductFound !== undefined) {
                //ProductFound.qtd = ProductFound.qtd + 1;
                ProductFound.qtd = elem.previousElementSibling.lastElementChild.previousElementSibling.getAttribute("qtd");
            } else {
                let obj = {
                    id: currentId,
                    qtd: elem.previousElementSibling.lastElementChild.previousElementSibling.getAttribute("qtd")
                }
                carrinho.push(obj);
            }
            document.getElementById('quantity').innerText = carrinho.length;
            console.log(carrinho)
        }
    });

}

function incrementQuantityDisplay() {
    let teste = Array.from(document.querySelectorAll(".plus"));
    teste.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();    
            let htmlDisplay = elem.previousElementSibling;
            let res = Number(htmlDisplay.getAttribute("qtd"))+1;
            htmlDisplay.innerHTML = res;
            htmlDisplay.setAttribute("qtd",res);          
        }
    })
}

function decrementQuantityDisplay() {
    let teste = Array.from(document.querySelectorAll(".minus"));
    teste.map(elem => {
        elem.onclick = function (e) {
            e.preventDefault();    
            let htmlDisplay = elem.nextElementSibling;
            let res = Number(htmlDisplay.getAttribute("qtd"))-1;
            if(res < 1){
                res = 1;   
            }
            htmlDisplay.innerHTML = res;
            htmlDisplay.setAttribute("qtd",res);          
        }
    })
}
