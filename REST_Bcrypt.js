var mysql   = require("mysql");


function REST_ROUTER(router,connection,Bcrypt,jwt) {
    var self = this;
    self.handleRoutes(router,connection,Bcrypt,jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,Bcrypt,jwt) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post('/login', function (req, res) {
        
        var email = req.body.email;
        var password = req.body.password;

        // var salt = Bcrypt.genSaltSync();
        // var encryptedPassword = Bcrypt.hashSync(password, salt);
     
        var query = "SELECT user_password FROM ?? WHERE ??=? LIMIT 1";
        var table = ["user_login","user_email",email];

        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } 

            // Bcrypt.compare(password, rows[0].user_password, function(err, res) { 
            //     if(res) {
            //         // Passwords match
            //         console.log("IN");
            //     } else {
            //         // Passwords don't match
            //         console.log("OUT");
            //     }                 
            // });           


            var orgPassword = Bcrypt.compareSync(password, rows[0].user_password);
            console.log(orgPassword);
      
            if (Bcrypt.compareSync(password, rows[0].user_password)) {

                const token = jwt.sign(email, 'secret_key_goes_here');
                
                res.json({
                    "Error" : false, 
                    "Message" : "Success", 
                    "Users" : rows, 
                    token : token
                });

            } else {

                res.json({"Error" : true, "Message" : "Salah password or email tidak ditemukan"});                
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

        var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, 10);
     
        // var orgPassword = Bcrypt.compareSync(password, encryptedPassword);

        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        // var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
        var table = ["user_login","user_email","user_password",email,encryptedPassword];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

    router.put("/users",function(req,res){

        var email = req.body.email;
        var password = req.body.password;

        var salt = Bcrypt.genSaltSync(10);
        var encryptedPassword = Bcrypt.hashSync(password, salt, null);

        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        // var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        var table = ["user_login","user_password",encryptedPassword,"user_email",email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+email});
            }
        });
    });

    router.put("/users/:user_id",function(req,res){

        var user_id = req.params.user_id;
        var email = req.body.email;
        var password = req.body.password;

        var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, 10);

        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        // var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email,"user_id",req.params.user_id];
        var table = ["user_login","user_password",encryptedPassword,"user_email",email,"user_id",user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+email});
            }
        });
    });

    router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });
}

module.exports = REST_ROUTER;
