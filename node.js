var mysql      = require('mysql');
var neo4j = require('neo4j');
var wn = require('when');

var db = new neo4j.GraphDatabase('http://neo4j:neo4@localhost:7474');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hami'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

/*connection.query('SELECT * from project_info', function (error, results, fields) {
  if (error) throw error;
  else {
    for(var i = 0; i < results.length; i++){
        var insertQuery = "MERGE (p1:project_info {email: {email}, project_title: {project_title}, project_id: {project_id}, user_id: {user_id}, tell: {tell}}) RETURN p1.email as email, p1.project_id as project_id, p1.project_title as project_title, p1.tell as tell, p1.user_id as user_id";
        var newResult = results[i];
        var newUser = {
          email:newResult.email,
          project_title:newResult.project_title,
          project_id:newResult.project_id,
          user_id:newResult.user_id,
          tell:newResult.tell
        }
        callbackInsert = function(err, data) {
                            // console.log("avariin");
                        };
        db.cypher({ query: insertQuery, params: newUser}, callbackInsert);
        // console.log(newUser);
    }
  }
});*/

/*connection.query('SELECT * from wp_comments', function (error, results, fields) {
  if (error) throw error;
  else {
    for(var i = 0; i < results.length; i++){
        var insertQuery = "MERGE (p4:wp_comments {comment_ID: {comment_ID}, comment_karma: {comment_karma}, comment_approved: {comment_approved}, comment_agent: {comment_agent}, comment_parent: {comment_parent}, user_id: {user_id}, comment_post_ID: {comment_post_ID}, comment_author: {comment_author}, comment_author_email: {comment_author_email}, comment_author_IP: {comment_author_IP}, comment_date: {comment_date}, comment_date_gmt: {comment_date_gmt}, comment_content: {comment_content}}) RETURN p4";
        var newResult = results[i];
        var newUser = {
          comment_ID:newResult.comment_ID,
          comment_post_ID:newResult.comment_post_ID,
          comment_author:newResult.comment_author,
          comment_author_email:newResult.comment_author_email,
          comment_author_IP:newResult.comment_author_IP,
          comment_karma:newResult.comment_karma,
          comment_approved:newResult.comment_approved,
          comment_agent:newResult.comment_agent,
          user_id:newResult.user_id,
          comment_content:newResult.comment_content,
          comment_parent:newResult.comment_parent,
          comment_date:newResult.comment_date,
          comment_date_gmt:newResult.comment_date_gmt  
        }
        callbackInsert = function(err, data) {
                            // console.log("Good");
                        };
        db.cypher({ query: insertQuery, params: newUser}, callbackInsert);
        // console.log(newUser);
    }
}
});*/

/*connection.query('SELECT * from wp_users', function (error, rows, fields) {
  if (error) throw error;
  else{*/
    connection.query('SELECT * from pay_info', function (error, lines, fields) {
      if (error) throw error;
      else{
        // console.log(lines);
        connection.query('SELECT * from wp_ign_products', function (error, results, fields) {
          if (error) throw error;
          else {
            var promises = results.map(function (newResult, index) {
              return wn.promise(function(resolve, reject){
                var insertProject = "MERGE (p1:wp_ign_products {id: {id}, user_id: {user_id}, product_name: {product_name}, product_details: {product_details}, product_price: {product_price}, goal: {goal}, created_at: {created_at}})";
                var projectData = {
                  id:newResult.id,
                  user_id:newResult.user_id,
                  product_name:newResult.product_name,
                  product_details:newResult.product_details,
                  product_price:newResult.product_price,
                  created_at:newResult.created_at,
                  goal:newResult.goal 
                }
                callbackInsertProject = function(err, data) {
                  if(err)
                    return reject(err);
                  else
                    return resolve();
                };
                db.cypher({ query: insertProject, params: projectData}, callbackInsertProject);
              });
            });

            wn.all(promises).then(function(promisesResults){
            /*  rows.forEach(function(newRow){ 
                var insertUsersProjects = "CREATE (p2:wp_users {ID: {ID}, user_login: {user_login}, user_pass: {user_pass}, user_email: {user_email}}) WITH p2 MATCH (p1 {user_id: p2.ID}) MERGE (p2)-[r:Define]->(p1)"; 
                var userData = {
                  ID:newRow.ID,
                  user_login:newRow.user_login,
                  user_pass:newRow.user_pass,
                  user_email:newRow.user_email
                }
                callbackInsertUser = function(err, data) {
                  console.log(data)
                                };
                db.cypher({ query: insertUsersProjects, params: userData}, callbackInsertUser);
                // console.log(newUser);
               });*/
              lines.forEach(function(newLine){
                // console.log(newLine.hami_id);
                var insertHamiProjects = "MERGE (p3:pay_info {hami_id: {hami_id}, first_name: {first_name}, last_name: {last_name}, email: {email}, product_id: {product_id}, transaction_id: {transaction_id}, product_level: {product_level}, prod_price: {prod_price}, created_at: {created_at}, tell: {tell}, card_number: {card_number}, hide_me: {hide_me}}) WITH p3 MATCH (p3),(p1) WHERE p1.id = p3.product_id MERGE (p3)-[rel:SUPPORT]->(p1) RETURN p3.hami_id, rel, p1";
                var hamiData = {
                  hami_id:newLine.hami_id,
                  first_name:newLine.first_name,
                  last_name:newLine.last_name,
                  email:newLine.email, 
                  product_id:newLine.product_id,
                  transaction_id: newLine.transaction_id,
                  product_level: newLine.product_level,
                  prod_price: newLine.prod_price,
                  created_at: newLine.created_at,
                  tell: newLine.tell,
                  card_number: newLine.card_number,
                  hide_me: newLine.hide_me
                }
                callbackInsertHami = function(err, data) {
                    console.log(data);
                                };
                db.cypher({ query: insertHamiProjects, params: hamiData}, callbackInsertHami);
              })
             });
            }
         });
        }
    });
/*  }
  });*/
// connection.end();