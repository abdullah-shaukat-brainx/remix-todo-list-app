const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

export const isValidEmailFormat = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

export const isValidPasswordFormat = (password) => {
  return PASSWORD_REGEX.test(String(password));
};
