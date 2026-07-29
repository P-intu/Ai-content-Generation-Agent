export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateRegister({ fullName, username, email, password, confirmPassword }) {
  const errors = {}
  if (!fullName) errors.fullName = 'Full name is required.'
  if (!username) errors.username = 'Username is required.'
  if (!email) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}
