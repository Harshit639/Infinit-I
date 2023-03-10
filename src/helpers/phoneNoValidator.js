export function phoneNoValidator(phoneNo) {
    if (phoneNo.length<10) return "Phone Number should be 10 digit long."
    return ''
  }