import jsonwebtoken from 'jsonwebtoken'

export default function (req, res, next) {

    if (req.method === "OPTIONS")
        next();

    try {
        let token = req.headers.authorization.split(' ')[1];
        
        if (!token)
            throw '';

        let decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({message:'No authorization'})
    }
};