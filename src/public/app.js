const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const codigoInput = document.getElementById("codigo");

const accessTokenInput = document.getElementById("accessToken");
const refreshTokenInput = document.getElementById("refreshToken");
const resultado = document.getElementById("resultado");

const btnPaso1 = document.getElementById("btnPaso1");
const btnPaso2 = document.getElementById("btnPaso2");
const btnRefresh = document.getElementById("btnRefresh");
const btnEspacio = document.getElementById("btnEspacio");
const btnAdmin = document.getElementById("btnAdmin");

const mostrarResultado = (data) => {
  resultado.textContent = JSON.stringify(data, null, 2);
};

btnPaso1.addEventListener("click", async () => {
  try {
    const res = await fetch("/login-paso1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo: correoInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();
    mostrarResultado(data);
  } catch (error) {
    mostrarResultado({ error: error.message });
  }
});

btnPaso2.addEventListener("click", async () => {
  try {
    const res = await fetch("/login-paso2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo: correoInput.value,
        codigo: codigoInput.value
      })
    });

    const data = await res.json();

    if (data.accessToken) {
      accessTokenInput.value = data.accessToken;
      localStorage.setItem("accessToken", data.accessToken);
    }

    if (data.refreshToken) {
      refreshTokenInput.value = data.refreshToken;
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    mostrarResultado(data);
  } catch (error) {
    mostrarResultado({ error: error.message });
  }
});

btnRefresh.addEventListener("click", async () => {
  try {
    const refreshToken =
      refreshTokenInput.value || localStorage.getItem("refreshToken");

    const res = await fetch("/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await res.json();

    if (data.accessToken) {
      accessTokenInput.value = data.accessToken;
      localStorage.setItem("accessToken", data.accessToken);
    }

    mostrarResultado(data);
  } catch (error) {
    mostrarResultado({ error: error.message });
  }
});

btnEspacio.addEventListener("click", async () => {
  try {
    const token = accessTokenInput.value || localStorage.getItem("accessToken");

    const res = await fetch("/mi-espacio", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    mostrarResultado(data);
  } catch (error) {
    mostrarResultado({ error: error.message });
  }
});

btnAdmin.addEventListener("click", async () => {
  try {
    const token = accessTokenInput.value || localStorage.getItem("accessToken");

    const res = await fetch("/dashboard-admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    mostrarResultado(data);
  } catch (error) {
    mostrarResultado({ error: error.message });
  }
});

window.addEventListener("load", () => {
  const savedAccessToken = localStorage.getItem("accessToken");
  const savedRefreshToken = localStorage.getItem("refreshToken");

  if (savedAccessToken) {
    accessTokenInput.value = savedAccessToken;
  }

  if (savedRefreshToken) {
    refreshTokenInput.value = savedRefreshToken;
  }
});