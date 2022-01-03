import * as Yup from "yup";

const registrationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["EMAIL", "PHONE"], "invalid type")
    .required("type is required"),
  email: Yup.string()
    .email()
    .when("type", {
      is: "EMAIL",
      then: Yup.string().email("invalid email").required("email is required"),
    }),
  phone: Yup.string().when("type", {
    is: "PHONE",
    then: Yup.string().matches(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "invalid phone number"
    ),
  }),
});

export default registrationSchema;
