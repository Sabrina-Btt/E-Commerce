document.getElementById("entrar").onclick = function (e) {
    e.preventDefault();
    let form = document.getElementById('login');
    getUserBd(form.elements[0].value, form.elements[1].value)
}

function getUserBd(email, senha) {
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
                        email: { eq: "${email}" }
                        password: {eq: "${senha}"}
                      }
                    ) {
                      id
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allUsers.length !== 0) {
                liberaAcesso();
            } else {
                alert("Acese Negado!!!!!!!");
            }
        })
        .catch((error) => {
            console.log(error);
        });

}

function liberaAcesso() {
    console.log("Acesso Liberado!");
}