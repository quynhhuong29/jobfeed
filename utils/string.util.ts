const isUrl = (str: string) => {
  // Regular expression pattern for URL validation
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  return urlPattern.test(str);
};

export { isUrl };
