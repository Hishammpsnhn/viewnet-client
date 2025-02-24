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
export const subscriptionPlan = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain letters, numbers, and spaces"
    ),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .max(10000, "Price cannot exceed 10,000"),
  sessionLimit: Yup.number()
    .required("Session limit is required")
    .integer("Session limit must be a whole number")
    .positive("Session limit must be a positive number")
    .max(100, "Session limit cannot exceed 100"),
  duration: Yup.number()
    .required("Duration is required")
    .integer("Duration must be a whole number")
    .positive("Duration must be a positive number")
    .max(365, "Duration cannot exceed 365 days"),
});

//genre

export const genreValidation = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain letters, numbers, and spaces"
    ),
  description: Yup.string().required("Description is required"),
  //isAction:Yup.boolean().required("Action is required"),
});

// upload

export const movieUpload = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .min(3, "Description must be at least 3 characters long")
    .required("Description is required"),
  genre: Yup.string().required("Genre is required"),
  releaseDateTime: Yup.string()
    .test(
      "is-valid-date",
      "Date and time must be valid",
      (value: string | undefined) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    )
    .test(
      "is-future",
      "Release date must be in the future",
      (value: string | undefined) => {
        if (!value) return false;
        const date = new Date(value);
        return date > new Date();
      }
    )
    .required("Date and time are required"),
 
});
export const seriesUpload = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .min(3, "Description must be at least 3 characters long")
    .required("Description is required"),
  genre: Yup.string().required("Genre is required"),
  releaseDateTime: Yup.string()
    .test(
      "is-valid-date",
      "Date and time must be valid",
      (value: string | undefined) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    )
    .test(
      "is-future",
      "Release date must be in the future",
      (value: string | undefined) => {
        if (!value) return false;
        const date = new Date(value);
        return date > new Date();
      }
    )
    .required("Date and time are required"),
 
});
