var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var port = process.env.PORT || 8083;
var looks = require('./looks.js')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/', function (req,res) {
	var face = req.body.face;
	var width = req.body.w;
	var height = req.body.h;
	if(!face || !width || !height) {
		console.log('参数不能为空')
		res.json({
	  		code: 0,
	  		err: '参数不能为空'
	  	});
	} else {
		var look = looks.getData(face, width, height);
		if(look && look.LooksTotalScore) {
			res.json(look)
		} else {
			console.log('无法解析')
		  	res.json({
		  		code: 0,
		  		err: '无法解析'
		  	});
		}	
	}
})


http.listen(port, function(){
	console.log('listen:===', port)
});


