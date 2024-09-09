import * as yup from "yup";

const password_rules = yup
  .string()
  .min(8, "Senha precisa ter no mínimo 8 caracteres.")
  .matches(/[A-Z]/, "Senha precisa ter ao menos uma letra maiúscula")
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "Senha precisa ter ao menos um caracter especial.")
  .required("Senha é obrigatória.");

const schema = {
    create: yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: password_rules,
    }).noUnknown(true, "Teclas desconhecidas não são permitidas."),
    login: yup.object({
        email: yup.string().email().required(),
        password: yup.string().required("Senha é obrigatória."),
    }).noUnknown(),
};

export default {
    login: schema.login,
    create: schema.create,
};
