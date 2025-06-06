import jwt from 'jsonwebtoken';
const jwtAuth = (req,res,next)=>{
    try{
    let token = req.cookies?.token;
    if (!token) {
        console.log("No token found, redirecting...");
        return res.redirect(`${process.env.URL}/login`);
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
        return res.redirect(`${process.env.URL}/login`);
    }
}

export default jwtAuth;