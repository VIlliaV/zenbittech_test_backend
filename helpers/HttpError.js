const messagesList = {
  400: 'missing field',
  401: 'Email or password is wrong',
  404: 'Not Found',
  409: 'Email in use',
};

const HttpError = (status, message = messagesList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
