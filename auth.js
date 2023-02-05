import jwt from "jsonwebtoken";

export const jwtAuth = (req, res, next) => {
  const authToken = req.cookies.AuthToken;
  try {
    const user = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("AuthToken");
    return res.redirect("/");
  } 
}