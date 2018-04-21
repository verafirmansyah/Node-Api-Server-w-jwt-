var mysql   = require("mysql");
process.env.SECRET_KEY = "secret_key_goes_here";

function REST_ROUTER(router,connection,md5,jwt) {
    var self = this;
    self.handleRoutes(router,connection,md5,jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5,jwt) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post('/login', function (req, res) {
        
        var email = req.body.email;
        var password = req.body.password;

        var query = "SELECT user_password FROM ?? WHERE ??=? LIMIT 1";
        var table = ["user_login","user_email",email];

        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {

                if (md5(password) === rows[0].user_password) {
                    
                    const token = jwt.sign(email, process.env.SECRET_KEY);
                    
                    res.json({
                        "Error" : false, 
                        "Message" : "Success", 
                        "Users" : rows, 
                        token : token
                    });
    
                } else {
    
                    res.json({"Error" : true, "Message" : "Salah password or email tidak ditemukan"});                
                }
                                    
            }

        });
          
    });
    

    router.get("/users",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });

    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user_login","user_id",req.params.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });

    router.post("/users",function(req,res){

        var email = req.body.email;
        var password = req.body.password;

        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login","user_email","user_password",email,md5(password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

    // router.put("/users",function(req,res){

    //     var email = req.body.email;
    //     var password = req.body.password;

    //     var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    //     var table = ["user_login","user_password",md5(password),"user_email",email];
    //     query = mysql.format(query,table);
    //     connection.query(query,function(err,rows){
    //         if(err) {
    //             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    //         } else {
    //             res.json({"Error" : false, "Message" : "Updated the password for email "+email});
    //         }
    //     });
    // });

    router.put("/users", ensureToken, function(req,res){

        jwt.verify(req.token, process.env.SECRET_KEY, function(err, data) {
            if (err) {
                res.json({"Error" : true, "Message" : "Token salah"});
            } else {

                // var user_id = req.params.user_id;
                var email = req.body.email;
                var password = req.body.password;
        
                var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                var table = ["user_login","user_password",md5(password),"user_email",email];
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                    if(err) {
                        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                    } else {
                        res.json({"Error" : false, "Message" : "Updated the password for email "+email});
                    }
                });                        

            }
        });
              
    });

    router.delete("/users/:user_id", ensureToken, function(req,res){

        jwt.verify(req.token, process.env.SECRET_KEY, function(err, data) {
            if (err) {
                res.json({"Error" : true, "Message" : "Token salah"});
            } else {
        
                var query = "DELETE from ?? WHERE ??=?";
                var table = ["user_login","user_id",req.params.user_id];
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                    if(err) {
                        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                    } else {
                        res.json({"Error" : false, "Message" : "Deleted the user"});
                    }
                });
            }
        });
    });

    function ensureToken(req, res, next) {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.json({"Error" : true, "Message" : "Token salah"});
        }
    }
        
}

module.exports = REST_ROUTER;
