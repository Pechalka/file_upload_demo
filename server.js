



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
        imageVersions: {
            thumbnail: {
                width: 80,
                height: 80
            }
        }
    });

var docs = [
    { title : 'massage', status : 'Checked', id : 1 , files : []},
    { title : 'Tanning', status : 'Invalid', id : 2 , files : []},
    { title : 'Blow Dry', status : 'Not hecked', id : 3 , files : []}
];

var remove_file = function(file_name, doc_id){
	var doc_id = parseInt(doc_id)

	for (var i = docs.length - 1; i >= 0; i--) {
		var d = docs[i];
		if (d.id == doc_id){
			var index = d.files.indexOf(file_name);
			d.files.splice(index, 1);
		}

	};	
}

var add_file = function(file_name, doc_id){
	var doc_id = parseInt(doc_id)

	for (var i = docs.length - 1; i >= 0; i--) {
		var d = docs[i];
		if (d.id == doc_id)
			d.files.push(file_name);

	};		
}



app.use('/uploads', function (req, res) {
	var doc_id = req.url.split('/')[1]; // /uploads/2 => 2 - doc_id
    upload.fileHandler({
    	tmp : { doc_id : doc_id},
        uploadDir: __dirname + '/public/uploads/' + doc_id,
        uploadUrl:  '/uploads/' + doc_id
    })(req, res)
    .on('delete', function(file_name){
    	remove_file(file_name, doc_id)
    })
    .on('end',function(fileInfo){
    	add_file(fileInfo.name, doc_id);
    });

});

app.get('/api/docs', function(req, res){
	res.json(docs);
})


var server = http.createServer(app);
server.listen(4000, function(){
    console.log('Express server listening on port ' + 4000);
});
