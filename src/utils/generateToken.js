import jwt from "jsonwebtoken";
import "dotenv/config"

// generate a token
// the token stores a part of the user (their id) in itself
// then the token is used to identify the user each time they make any request

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })

  res.cookie("jwt", token, {
    httpOnly: true, // this prevents the token to be accessed by client side javascript
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // stop the browser from sending this cookie cross sites (protects against CSRF attack)
    maxAge: (1000*60*60*24) * 7, // in ms
  });

  return token;
};
