/*--------------------------------------------
Déclaration des librairies
--------------------------------------------*/
var express = require('express'),
  nStore = require('nstore'),
  app = express();

nStore = nStore.extend(require('nstore/query')());

/*--------------------------------------------
Paramétrages de fonctionnement d'Express
--------------------------------------------*/
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('goodfilm'));
app.use(express.session({
  secret: "goodfilm"
}));

/*--------------------------------------------
Définition des "bases" posts & users
--------------------------------------------*/
var films, users;
var connectedUsers = [];

films = nStore.new("films.db", function() {
  users = nStore.new("users.db", function() {
   
    Routes();
    app.listen(3000);
    console.log('Express app started');

  });
});

function addUser(user) {
  users.save(null, user, function(err, key) {
    if (err) {
      console.log("Erreur : ", err);
    } else {
      user.id = key;
      console.log(user);
    }
  });
}

function addUsers() {
  addUser({
    email     : "user",
    password  : "user",
    isAdmin   : false,
    firstName : "user",
    lastName  : ""
  });
  addUser({
    email     : "admin",
    password  : "admin",
    isAdmin   : true,
    firstName : "admin",
    lastName  : ""
  });
}

function findUserByMail(email) {
 
  return connectedUsers.filter(function(user) {
    return user.email == email;
  })[0];
}

function findUserBySession(sessionID) {
 
  return connectedUsers.filter(function(user) {
    return user.sessionID == sessionID;
  })[0];

}


haveToBeAdmin = function(req, res, next) {
  console.log("L'utilisateur doit avoir les droits administrateur !");
  if (findUserBySession(req.sessionID)) {
    if (findUserBySession(req.sessionID).isAdmin == true) {
      next();
    } else {
      throw "Vous devez être administrateur";
    }
  } else {
    throw "Vous devez être connecté";
  }
}

function Routes() {

  app.get('/addusers', function(req, res) {
      addUsers();
      res.json({
        MESSAGE: "Utilisateur(s) ajouté(s)"
      });
    });


  app.post('/authenticate', function(req, res) {
                console.log("POST authenticate ", req.body);
                //Je récupère les information de connexion de l'utilisateur
                var user = req.body;

                if (findUserByMail(user.email)) {
                  res.json({
                    infos: "Utilisateur déjà connecté !"
                  })
                } else { 
                  users.find({
                    email: user.email,
                    password: user.password
                  },

                  function(err, results) {
                    if (err) {
                      res.json({
                        error: "Cet utilisateur n'existe pas."
                      });
                    } else {
                      
                      var key = Object.keys(results)[0],
                        authenticatedUser = results[key];

                      //Je rajoute l'id de session à l'objet utilisateur

                      authenticatedUser.key = key;
                      authenticatedUser.sessionID = req.sessionID;

                      //Ajouter l'utilisateur authentifié à la liste des utilisateurs connectés
                      connectedUsers.push(authenticatedUser);

                      //Je renvoie au navigateur les informations de l'utilisateur
                      res.json({
                        email: authenticatedUser.email,
                        firstName: authenticatedUser.firstName,
                        lastName: authenticatedUser.lastName,
                        isAdmin: authenticatedUser.isAdmin
                      });
                    }
                  });
                }

              });


  app.get('/logoff', function(req, res) {
          
          var alreadyAuthenticatedUser = findUserBySession(req.sessionID);

          if (alreadyAuthenticatedUser) {
            //Je l'ai trouvé, je le supprime de la liste des utilisateurs connectés
            var posInArray = connectedUsers.indexOf(alreadyAuthenticatedUser);
            connectedUsers.splice(posInArray, 1);
            res.json({
              state: "disconnected"
            });
          } else {
            res.json({});
          }

      });

  app.get('/alreadyauthenticated', function(req, res) {

    var alreadyAuthenticatedUser = findUserBySession(req.sessionID);

    //Si je suis déjà authentifié, renvoyer les informations utilisateur
    if (alreadyAuthenticatedUser) {
      res.json({
        email: alreadyAuthenticatedUser.email,
        firstName: alreadyAuthenticatedUser.firstName,
        lastName: alreadyAuthenticatedUser.lastName,
        isAdmin: alreadyAuthenticatedUser.isAdmin
      });
    } else {
      return res.json({});
    }

  });

  
  /*
     liste de tous les films lorsqu'on a l'url http://localhost:3000/blogposts
     en mode GET
  */
  app.get('/blogfilms', function(req, res) {
    console.log("GET (ALL) : /blogfilms");
    films.all(function(err, results) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        var films = [];
        for (var key in results) {
          var film = results[key];
          film.id = key;
          films.push(film);
        }
        res.json(films);
      }
    });
  });

  
  /*
    liste de tous les films correspondant à un critère
    lorsque l'on a l'url http://localhost:3000/blogposts/query/ en
    mode GET avec une requête en paramètre
    
  */
  app.get('/blogfilms/query/:query', function(req, res) {
    console.log("GET (QUERY) : /blogfilms/query/" + req.params.query);

    films.find(JSON.parse(req.params.query), function(err, results) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        var films = [];
        for (var key in results) {
          var film = results[key];
          film.id = key;
          films.push(film);
        }
        res.json(films);
      }
    });

  });


  /*
    Retrouver un film par sa clé unique lorsqu'on a l'url http://localhost:3000/blogposts/identifiant_du_post
    en mode GET
  */
  app.get('/blogfilms/:id', function(req, res) {
    console.log("GET : /blogfilms/" + req.params.id);
    films.get(req.params.id, function(err, film, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);

      } else {
        film.id = key;
        res.json(film);
      }
    });
  });

  /*
    Créer un nouveau film lorsqu'on a l'url http://localhost:3000/blogpost
    avec en paramètre le film au format JSON en mode POST
  */
  app.post('/blogfilms', [haveToBeAdmin], function(req, res) {
    console.log("FILM CREATE ", req.body);

    var d = new Date(),
     film = req.body;
    film.saveDate = (d.valueOf());

    films.save(null, film, function(err, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        film.id = key;
        res.json(film);
      }
    });
  });


  /*
    Mettre à jour un film lorsqu'on a l'url http://localhost:3000/blogpost
    avec en paramètre le film au format JSON en mode PUT
  */
  app.put('/blogfilms/:id', [haveToBeAdmin], function(req, res) {
    console.log("PUT UPDATE", req.body, req.params.id);

    var d = new Date(),
      film = req.body;
    film.saveDate = (d.valueOf());

    films.save(req.params.id, film, function(err, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        res.json(film);
      }
    });
  });

  /*
    supprimer un film par sa clé unique lorsqu'on a l'url http://localhost:3000/blogpost/identifiant_du_post
    en mode DELETE
  */
  app.delete('/blogfilms/:id', [haveToBeAdmin], function(req, res) {
    console.log("DELETE : /delete/" + req.params.id);

    films.remove(req.params.id, function(err) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        // on ré-ouvre la base lorsque la suppression a été faite
        films = nStore.new("films.db", function() {
          res.json(req.params.id);
          
        });
      }
    });
  });
}