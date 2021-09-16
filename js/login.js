setTimeout(() => { login() }, 1000)

function login() {
    document.getElementById("entrar").onclick = function (e) {
        e.preventDefault();
        let form = document.getElementById('login');
        getUserBd(form.elements[0].value, form.elements[1].value)
    }
}


function getUserBd(email, senha) {
    if (!email || !senha)
        return;
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
                      fullName
                      phone
                      address{
                          id
                      }
                    }
                }`
            }),
        }
    )
        .then(res => res.json())
        .then((res) => {
            if (res.data.allUsers.length !== 0) {
                liberaAcesso(res.data.allUsers[0]);
            } else {
                alert("Acesso Negado!!!!!!!");
            }
        })
        .catch((error) => {
            console.log(error);
        });

}

function liberaAcesso(userInfo) {
    if (!userInfo.id)
        return;
    localStorage.setItem("userId", `${userInfo.id}`);
    localStorage.setItem("userPhone", `${userInfo.phone}`);
    localStorage.setItem("userName", `${userInfo.fullName}`);
    localStorage.setItem("userAddress", `${userInfo.address.id}`);
    alert("Acesso Liberado!");
    window.location.assign("index.html");
}

