const loadFormModule = require("./load-form");

exports.handler = async function (event, context) {
  return loadFormModule.handler(event, context);
};
