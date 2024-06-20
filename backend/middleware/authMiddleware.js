import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// User must be authenticated
const protect = async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.status("Not authorized, token failed");
    }
  } else {
    return res.status(401).send({ message: 'Not authorized, no token' });
}
};

// User must be an admin
const admin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.user.isAdmin) {
            req.user = decoded;
            next();
        } else {
            res.status(401).send({ message: 'Not authorized as an admin' });
        }
    } catch (error) {
        res.status(401).send({ message: 'Not authorized, token failed' });
    }
};

export { protect, admin };
