const response = (Codestatus, message, data, status, res) => {
  res.status(Codestatus).json({
    Codestatus,
    message,
    data,
    status,
  });
};

module.exports = response;
