export const usuarios = [
  {
    id: 1,
    nombre: "Administrador Biblioteca",
    correo: "sebastian.c.ramos.t@gmail.com",
    password: "admin123",
    rol: "admin",
    librosPrestados: [],
    codigo2FA: null,
    codigo2FAExpira: null,
    refreshToken: null,
    refreshTokenExpira: null
  },
  {
    id: 2,
    nombre: "Sebastian Estudiante",
    correo: "sebastian.c.ramos.t@gmail.com",
    password: "estudiante123",
    rol: "estudiante",
    librosPrestados: [
      "Cien años de soledad",
      "Clean Code",
      "El principito"
    ],
    codigo2FA: null,
    codigo2FAExpira: null,
    refreshToken: null,
    refreshTokenExpira: null
  }
];