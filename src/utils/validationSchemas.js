import * as yup from 'yup';

const schema = {
  firstname: yup
    .string()
    .trim()
    .required('First name cannot be blank')
    .matches(/^[a-zA-Z]+$/, 'Only letters are allowed!'),
  lastname: yup
    .string()
    .required('Last name cannot be blank')
    .trim()
    .matches(/^[a-zA-Z]+$/, 'Only letters are allowed!'),
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(
      /^[a-zA-Z0-9-_@.]+$/,
      'Username must contain only alphanumeric characters and/or the following special characters: -, _, @, and .'
    ),
  email: yup.string().email().required('Email cannot be blank'),
  password: yup
    .string()
    .required('Password cannot be blank')
    .max(15)
    .min(8)
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password must contain a letter, a number & a special character!'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password cannot be blank')
    .max(15)
    .min(8)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Confirm Password must contain a letter, a number & a special character!'
    )
    .oneOf([yup.ref('password'), null], 'Password must match'),
  isPrivate: yup.string().required('Please select one type'),
  title: yup.string().required('Title cannot be blank'),
  description: yup.string(),
  image: yup.string().required('Please select image'),
};

export const profileSchema = {
  firstname: schema.firstname,
  lastname: schema.lastname,
  username: schema.username,
  email: schema.email,
  isPrivate: schema.isPrivate,
};
export const registrationSchema = {
  ...profileSchema,
  password: schema.password,
  confirmPassword: schema.confirmPassword,
};
export const postSchema = {
  title: schema.title,
  description: schema.description,
  image: schema.image,
  isPrivate: schema.isPrivate,
};
export const loginSchema = {
  email: schema.email,
  password: schema.password,
};
