/********************************************************************
 *
 * Filename     : app.js
 * Author       : Ravi Kiran Chadalawada
 *
 * Functionality: Runs a node.js server interacting with solr running 
                  on port 8983 and http-server running on port 8080.
                  It gets request from http-server(npm package) and 
                  queries solr, and replies back with data from  solr 
                  to http-server. 
                  Please refer to instrutions.pdf document in repo for 
		  more info on how to run this setup.
		  Report.pdf gives info on my results.
*************************************************************************/

var express = require('express');
var app     = express();
var solr    = require('solr-client');
var fs      = require('fs')

var client = solr.createClient();

var dict = Array(); // To declare a global dictionary to hold file mappings


/* Checking whether node can send file !!
app.get('/index.html', function(req,res) {
	res.sendFile( __dirname + "/" + "index.html" );
});*/

//app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer); // for parsing multipart/form-data


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//http://localhost:8983/solr/assignment3/select?fl=id&indent=on&q=hillary&sort=pageRankFile%20desc&wt=json

app.get('/', function (req, res) {
  //console.log(req);
	//console.log(req.query.id);
	var query = encodeURI(req.query.id);
	//console.log(query)
	var value = req.query.value;
	if (value == "default") {
	//console.log(req.query.value);
	var query = 'indent=on&q='+ query + '&wt=json';
	}
	else {
	//console.log(req.query.value);
	var query = 'indent=on&q='+ query + '&sort=pageRankFile%20desc&wt=json'
	}
	client.get('assignment3/select',query,function(err,obj){
   		if(err){
        		console.log(err);
   		}else{
			resp = obj;
			for(var doc in resp.response.docs){
				var fullpath = resp.response.docs[doc].id;
				var filename = fullpath.replace(/^.*[\\\/]/, '');
				//console.log(resp.response.docs[doc].id + ":" + dict[filename]);
				resp.response.docs[doc].id = dict[filename];
			}
			//print_url(obj.response.docs);
        		//console.log(obj.response.docs);
			 res.send(resp);
   		}
	});

  response = {
      first_name:'ravi kiran',
      last_name:'chadalawada'
   };

  //res.send(JSON.stringify(response));
});

function print_url(data)
{
	for(var doc in data){
		console.log(data[doc].id);
	}	
}
function make_dict() {
	fs.readFile('mapLATimesDataFile.csv', 'utf-8',function(err, data){
		if (err) {
        		throw err;
  		}
        	else{

			fill_dict(data);
                	//console.log("c99aec8e-3d68-4f79-91ad-621f05b824e5.html :" + dict['c99aec8e-3d68-4f79-91ad-621f05b824e5.html']);
        	}
	});
	fs.readFile('mapHuffingtonPostDataFile.csv', 'utf-8',function(err, data){
                if (err) {
                        throw err;
                }
                else{

                        fill_dict(data);
                        //console.log("c99aec8e-3d68-4f79-91ad-621f05b824e5.html :" + dict['c99aec8e-3d68-4f79-91ad-621f05b824e5.html']);
                }
        });
}

function fill_dict(data)
{
	var split_data = (data.split('\n'));
                for (var i in split_data)
                {
                        map = (split_data[i].split(','));
                        dict[map[0]] = map[1];
                }
}
app.listen(3000, function () {
	make_dict();
  console.log('Example app listening on port 3000!');
});

