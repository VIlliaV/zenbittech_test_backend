const multer = require('multer');
const path = require('path');
const { replaceDotWithEmail } = require('../helpers');

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const { originalname } = file;
    const [uniquePreffix, uniquePreffixAfterAt] = replaceDotWithEmail(
      req.user.email
    );
    const filename = `${uniquePreffix}_${uniquePreffixAfterAt}_avatar_${originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
