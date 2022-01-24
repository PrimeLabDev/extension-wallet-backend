import * as Yup from "yup";

const registrationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  walletName: Yup.string().required("Wallet name is required"),
  email: Yup.string().nullable(),
  phone: Yup.string().nullable(),
});

export default registrationSchema;
