import * as yup from "yup";

const schema = {
  createPost: {
    body: yup.object({
      title: yup.string().required("Título é obrigatório"),
      text: yup.string().required("Texto é obrigatório"),
    }).noUnknown(true, "Teclas desconhecidas não são permitidas"),
  },

  likePost: {
    params: yup.object({
      id: yup
        .number()
        .integer()
        .required()
        .positive(),
    }).noUnknown(true, "Teclas desconhecidas não são permitidas"),
  },
};

export default {
	createPost: schema.createPost,
	likePost: schema.likePost
};
