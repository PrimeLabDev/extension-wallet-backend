import * as Yup from "yup";

const registrationSchema = Yup.object().shape({
  mode: Yup.string()
    .oneOf(["email", "phone"], "invalid mode")
    .required("mode is required"),
  email: Yup.string()
    .email()
    .when("mode", {
      is: "email",
      then: Yup.string().email("invalid email").required("email is required"),
    }),
  phone: Yup.string().when("mode", {
    is: "phone",
    then: Yup.string().matches(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "invalid phone number"
    ),
  }),
});

export default registrationSchema;
