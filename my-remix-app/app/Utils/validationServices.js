const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const isValidEmailFormat = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

export const isValidPasswordFormat = (password) => {
  return PASSWORD_REGEX.test(String(password));
};
