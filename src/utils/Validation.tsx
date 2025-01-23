import * as Yup from "yup";

export const profileCreation = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .required("Name is required"),
  phone: Yup.string()
    .trim()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  dob: Yup.string()
    .required("Date of birth is required")
    .test("is-adult", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const age = new Date().getFullYear() - dob.getFullYear();
      return age >= 18;
    }),
});

export const newSecondProfileCreation = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .required("Name is required"),

  profile: Yup.string().required("Please select a profile"),
});

export const emailVerify = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
 
});
