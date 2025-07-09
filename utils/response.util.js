const response = (res, key, value, statusCode = 200, success = true) => {
  const data = {
    success,
    statusCode,
    [key]: value,
  };

  return res.status(statusCode).json(data);
};

module.exports = response;
