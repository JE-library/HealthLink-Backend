const response = (
  res,
  key,
  value,
  statusCode = 200,
  success = true,
  message = ""
) => {
  const data = {
    success,
    statusCode,
    message,
    [key]: value,
  };

  return res.status(statusCode).json(data);
};

module.exports = response;
