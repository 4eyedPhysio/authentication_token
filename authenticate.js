require("dotenv").config();

TOKENDB = process.env.API_KEY;

function authenticateUser(req, res){
  return new Promise((resolve, reject) => {
    authorizationHeader= req.headers.authorization;
   

    

    if(!authorizationHeader){
        reject("no token passed")
    }
    // since the first if statement has been passed and we dont want bearer to be part of our password, we will use the split method to separate the main password form the "bearer"
    const tokenPassedByuser = authorizationHeader.split(" ")[1];
    
    // using multiple if statements is better because it serves as a control block for each condition that is passed

    if(tokenPassedByuser !== TOKENDB){
        reject("invalid token")
    }
        resolve()
  })
};


module.exports={
    authenticateUser
};