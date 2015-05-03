
var request			= require('request');

var url = 'http://ip.jsontest.com/';

function onDownload (error, response, body) {
	if (!error && response.statusCode === 200) {
		var data = JSON.parse(body);
		console.log(data.ip);
	}



	var parseString = require('xml2js').parseString;
	var xml = '<root>Hello xml2js!</root>';
	parseString(xml, function (err, result) {
		console.dir(result);
	});
}

request(url, onDownload);

