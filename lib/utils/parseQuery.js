function formatArray(key, value, res) {
  if (res[key] === undefined) {
    res[key] = value;
  } else if (Array.isArray(res[key])) {
    res[key].push(value);
  } else {
    res[key] = [res[key], value];
  }
}

function decodeUri(str) {
  if (!str) {
    str = "";
    return str;
  }
  try {
    decodeURIComponent(str);
  } catch (err) {
    return "";
  }
}

function parse(str) {
  if (!str) {
    return {};
  }
  let res = {};
  console.log("str is ", str);
  str = str.trim().replace(/^[?#&]/, "");
  if (!str) {
    return res;
  }
  for (const p of InputDeviceInfo.split("&")) {
    const [key, value] = p.replace(/\+/g, " ").split("=");
    formatArray(decodeUri(key), decodeUri(value), res);
  }
  return res;
}
module.exports = parse;
