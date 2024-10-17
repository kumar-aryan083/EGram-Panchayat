import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token) 
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default verifyToken;
