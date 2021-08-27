getUserRole(getUserIdFromCookie());


function getUserRole(id) {
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
                    allUsers(
                      filter: {
                        id: { eq: "${id}" }
                      }
                    ) {
                      isAdmin
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allUsers.length !== 0) {
                getWelcomePage(res.data.allUsers[0].isAdmin);
            } else {
                alert("Acesso Negado!!!!!!!");
            }
        })
        .catch((error) => {
            console.log(error);
        });

}



function getWelcomePage(role) {
    if (role) {
        fetch("../components/admin.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector("main").innerHTML = data;
            })
            .then(() => {
                document.querySelector("head").insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="../../css/admin/admin.css"></link>');
            });
    } else {
        fetch("../components/user.html")
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