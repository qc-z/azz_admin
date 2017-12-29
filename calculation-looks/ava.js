

const request = require('request-promise')
var aa = 0



var starsTest = function () {
	aa++;
	let bb = {
		clientId:'5931202e8bb6cc383d8d4538',
		file:'face-test/E5hsGMMXke.jpg'
	}
	let url = 'http://106.75.64.209:8082/lookTestUrl';
    request({
        uri:url,
        json:bb,
        method:'post'
    })
    .then(function (body) {
        console.log(body)
        if(aa <= 100) {
        	// starsTest()
        	setTimeout(function() {
				starsTest()
			}, 1000)
        }
        // console.log(aa)
    })
    .catch(function(err) {
    	console.error(err)
    })
}

starsTest();

// var c=0
// var t
// function timedCount()
// {
// 	starsTest();
// 	c++;
// 	t=setTimeout(timedCount(),1000);
// 	if(c === 100) {
// 		stopCount();
// 	}
// }


// setInterval(function() {
// 	starsTest()
// }, 1000)




