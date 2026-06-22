import jwt from "jsonwebtoken";

const requireAuth = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ error: "Not authenticated. Please log in." });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
    }
};

const attachUserIfPresent = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.userId = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
    } catch (err) {
        req.userId = null;
    }

    next();
};

export { requireAuth, attachUserIfPresent };