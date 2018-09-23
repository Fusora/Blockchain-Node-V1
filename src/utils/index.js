function removePrefix(address) {
  if (address.length === 42) {
    return address.slice(2);
  }
  return null;
}

export default {
  removePrefix,
};
