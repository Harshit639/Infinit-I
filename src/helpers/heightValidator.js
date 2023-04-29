export function heightValidator(password) {
    if (!password) return "Height can't be empty."
    if (password<30) return 'Height should be greater than 30'
    return ''
  }