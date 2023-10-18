const HttpError = require('./HttpError');

const isBodyEmpty = async (req, _, next) => {
  const path = req.route.path;
  // const errMessage = path === '/:contactId/favorite' ? ' favorite' : '';
  let errMessage = '';

  switch (path) {
    case '/:contactId/favorite':
      errMessage = ' favorite';
      break;
    case '/subscription':
      errMessage = ' subscription';
      break;
    default:
      errMessage = '';
      break;
  }

  if (Object.keys(req.body).length === 0) {
    next(HttpError(400, `missing field${errMessage}`));
  }
  next();
};

module.exports = isBodyEmpty;
