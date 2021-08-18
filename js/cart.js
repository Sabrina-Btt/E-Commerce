getCartPage();
renderItems();

function getCartPage() {
    if (getInformationCookie()[0].length == 0) {
        fetch("../routes/cart.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector("main").innerHTML = data;
            })
            .then(() => {
                document.querySelector("head").insertAdjacentHTML('afterbegin', '<link rel="stylesheet" href="../../css/cart/cart.css"></link>');
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
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allProducts.length !== 0) {

                renderProductsCart(res.data.allProducts[0], qtd);

            } else {
                alert("Acesso Negado!!!!!!!");
            }
        })
        .catch((error) => {
            console.log(error);
        });

}

function renderProductsCart(product, qtd) {

    console.log(product);
    let listItems = document.getElementById("items-to-display");
    if (!listItems)
        return;
    let htmlInsert = `
        <div class="products">
                <img src="../../images/doces.png">
                <h4>${product.name}</h4>
                <h4>Quantidade: ${qtd}</h4>
                <h4>R$${product.price},00</h4>
                <i class="fa fa-times-circle fa-2x"></i>
        </div>
    `
    listItems.insertAdjacentHTML('beforeend', htmlInsert)
}

function renderItems() {
    let cartProducts = getCookieIdQtd();

    cartProducts.map(infoProd => {
        getCartProductsBd(infoProd[0], infoProd[1]);
    })

}



