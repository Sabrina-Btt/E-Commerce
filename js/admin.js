const client = new Dato.SiteClient("d2e7727e16065b64a486255d82e999");
let uploadArq;

setTimeout(() => { addProductToDB() }, 1000);
setTimeout(() => { getOrders() }, 1000);
setTimeout(() => { deleteOrder() }, 3000);
setTimeout(() => { deleteProduct() }, 1000);

function addProductToDB() {
    document.getElementById("add-product").onclick = function (e) {
        e.preventDefault();

        let form = document.getElementById("addProduct");

        async function createRecord() {
            try {
                const record = await client.items.create({
                    itemType: "972342", // model ID

                    inStock: form[4].value,
                    price: form[2].value,
                    name: form[0].value,
                    category: form[3].value,
                    description: form[1].value,
                    image: {
                        uploadId: uploadArq.id,
                    },

                });

                alert("Produto criado com sucesso!");
            } catch (error) {
                alert("Erro na criação do produto!");
            }
        }
        createRecord();
    }
}

async function UploadFile() {
    const fileInput = document.querySelector('#file-selector');
    let botao = document.getElementById("add-product");

    fileInput.addEventListener("change", async (event) => {
        botao.disabled = true;
        botao.style.backgroundColor = "#ffa7c5";
        botao.style.cursor = "no-drop";

        const files = event.target.files;
        for (let file of files) {
            const path = await createUpload(file)
            const upload = await client.uploads.create({
                path,
            });
            uploadArq = upload;

            botao.disabled = false;
            botao.style.backgroundColor = "#df7197";
            botao.style.cursor = "pointer";
            //Tornar o botão disponivel
        }
    });
}


async function createUpload(file) {

    const path = await client.createUploadPath(file, {
        filename: "custom-name.jpg",
        onProgress: (event) => {
            const { type, payload } = event;
            switch (type) {
                // fired before starting upload
                case "uploadRequestComplete":
                    //console.log(payload.id, payload.url);
                    break;
                // fired during upload
                case "upload":
                    //console.log(payload.percent);
                    break;
                default:
                    break;
            }
        },
    });
    return path;

}

function getOrders() {
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
                    allOrders {
                        id
                        username
                        userPhone
                        userAddress {
                          street
                          number
                          district
                          city
                        }
                        totalPrice
                        orderItems {
                          productname
                          quantity
                        }
                      }
                    
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allOrders.length != 0) {
                showOrders(res.data.allOrders);
            } else {
                alert("Sem pedidos no momento!! Não desista, vc vai conseguir!");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


async function showOrders(order) {

    for (elem of order) {
        var listOrder = document.getElementById("order");
        if (!listOrder)
            return;

        var htmlInsert = `

        <div id="new-order" class="new-order">

            <h4>Pedido Número: ${elem.id}</h4>
            <p>Nome Cliente: ${elem.username}</p>
            <p>Telefone de contato: ${elem.userPhone}</p>
            <p>Endereço de entrega: ${elem.userAddress.street}, ${elem.userAddress.number}, ${elem.userAddress.district}, ${elem.userAddress.city}</p> 
            <h4>Produtos:</h4>`

        for (item of elem.orderItems) {
            htmlInsert += `<p>Nome: ${item.productname}  Quantidade: ${item.quantity}</p>`

        }

        htmlInsert +=
            `<p>Valor Total: R$${elem.totalPrice},00</p>

            <button id='fin-order' class="text-button" productId=${elem.id}>
                Finalizar Pedido
            </button>
        </div>`

        listOrder.insertAdjacentHTML('beforeend', htmlInsert);
    }

}

function deleteOrder() {
    let orderToRemove = Array.from(document.querySelectorAll("#fin-order"));
    orderToRemove.map(order =>{
        order.onclick = function (e) {
            let elem = document.getElementById("fin-order");
            itemId = elem.getAttribute("productId");
            let NodeRemove = elem.parentNode;
            if (NodeRemove) {
                NodeRemove.parentNode.removeChild(NodeRemove);
            }
            e.preventDefault();
            client.items.destroy(itemId)
                .then((item) => {
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }) 
}

function deleteProduct() {
    document.getElementById("remove-product").onclick = function (e) {
        e.preventDefault();

        let form = document.getElementById("removeProduct");

        itemName = form[0].value;
        console.log(itemName);
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
                        allProducts(filter: {name: {eq: "${itemName.trim()}"}}) {
                            id
                        }
                                            
                    }`
                }),
            }
        )
            .then(res => res.json())
            .then((res) => {
                if (res.data.allProducts.length != 0) {
                    client.items.destroy(res.data.allProducts[0].id)
                        .then((item) => {
                            console.log(item);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    alert("Acesso Negado!!!!!!!");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}