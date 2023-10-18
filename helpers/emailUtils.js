const replaceDotWithEmail = email => {
  return email.replace('.', '_').split('@');
};

module.exports = replaceDotWithEmail;
