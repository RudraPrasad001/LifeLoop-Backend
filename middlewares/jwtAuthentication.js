import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const jwtAuth = (req,res,next)=>{
    try{
    let token = req.cookies?.token;
    if (!token) {
        console.log("No token found, redirecting...");
        return res.redirect("http://localhost:5173/login");
      }
        let user = jwt.verify(token,process.env.SECRET_KEY);
        req.token = user;
        
        console.log("verified")
        console.log(req.token);
        next();    
    }
    catch(e){
        console.log(e);
        res.clearCookie("token");
        return res.redirect("http://localhost:5173/login");
    }
}

export default jwtAuth;