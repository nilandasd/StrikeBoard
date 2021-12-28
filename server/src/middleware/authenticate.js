const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({message: "UNAUTHORIZED"});
  }
}

module.exports = authenticate;
