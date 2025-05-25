function leadingCharCheck(str) {
  if (str.charAt(0) === "/") {
    return str;
  }
  str = "/" + str;
  return str;
}

module.exports = leadingCharCheck;
