function verificaLogin()
{
    if(!sessionStorage.ID_USUARIO)
    {
        alert("Sua sessão expirou faça login novamente");
        window.location.href = "login.html";
    }
} 