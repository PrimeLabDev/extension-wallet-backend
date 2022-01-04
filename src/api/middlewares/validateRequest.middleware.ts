const ValidateRequestMiddleware = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (err) {
    console.info({ err });
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

export default ValidateRequestMiddleware;
