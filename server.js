var docs = [
    { title : 'massage', status : 'Checked', id : 1 , files : []},
    { title : 'Tanning', status : 'Invalid', id : 2 , files : []},
    { title : 'Blow Dry', status : 'Not hecked', id : 3 , files : []}
];



var express = require('express')
    , http = require('http')
    , path = require('path');

var app = express();


app.use(express.urlencoded())
app.use(express.json())
app.use(express.cookieParser());

app.use(express.session({secret : 'asxcfrgth'}));

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

var upload = require('jquery-file-upload-middleware');

upload.configure({
        uploadDir: __dirname + '/public/uploads',
        uploadUrl: '/uploads',
        imageVersions: {
            thumbnail: {
                width: 80,
                height: 80
            }
        }
    });

upload.on('end', function (fileInfo) { 
	console.log('end file>');
	console.log('fileInfo', fileInfo);
	console.log();
	
	var file_name = fileInfo.name;
	doc_id = parseInt(doc_id)

	for (var i = docs.length - 1; i >= 0; i--) {
		var d = docs[i];
		if (d.id == doc_id)
			d.files.push(file_name);

	};

});

upload.on('delete', function (fileInfo) { 
	console.log('delete file>');
	console.log('fileInfo', fileInfo);
	console.log();
	


	var file_name = fileInfo.name;
	doc_id = parseInt(doc_id)

	for (var i = docs.length - 1; i >= 0; i--) {
		var d = docs[i];
		if (d.id == doc_id){
			var index = d.files.indexOf(file_name);
			d.files.splice(index, 1);
		}

	};	
});


var doc_id;

app.use('/uploads', function (req, res, next) {
	doc_id = req.url.split('/')[1];


    upload.fileHandler({
        uploadDir: __dirname + '/public/uploads/' + doc_id,
        uploadUrl:  '/uploads/' + doc_id
    })(req, res, next);
});

app.get('/api/docs', function(req, res){


	res.json(docs);
})

app.use(express.bodyParser());

var server = http.createServer(app);
server.listen(4000, function(){
    console.log('Express server listening on port ' + 4000);
});
