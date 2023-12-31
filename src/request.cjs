const axios = require('axios');

const { url, over18 } = JSON.parse(process.argv[2]);
if (url == undefined || over18 == undefined)
	return logJson({ Error: 'Make sure url and over18 are present when calling the fuction' });
const cookies =
	'loid=000000000cpgoyl63y.2.1685878453258.Z0FBQUFBQmtmSGExaHc2eXdhVUdxTzlKOWd6eDFTbVlzQm83Q0phaVZFNDRYbDlRT251ZVdoaTRNeGp3ZTdHVGRDY1FKemxabU1hNjVnM0ZZSTlISWxBNVBDTV80SG5yMnlXYng1VDBjYVJXUTZyZEpzYk5ndEpVbExjWFRZR3I0ZUl5M3Q2b3NCbDI; csv=2; edgebucket=bbyF2yJ3R9wntuDxoJ; pc=n8; session_tracker=kqppcgrjanlqbiddlb.0.1685878576205.Z0FBQUFBQmtmSGN3dTUwZzA0RU9zM1BJaklkSUljLWg3TkxvXzZIQXpwUkNackZDYkptTTl6OEFMbndVOUhGMzRTTVNmNmhaVzZyMzJMZjdSU09GaUNSTjVPT3VSejZTbF91c1ZSN1R3T0RTcXJsYk1FUmZzdWRDck8zdmptWjY5TXh2dURHTFdkLUk;__utma=111542813.860871358.1703245096.1703245096.1703245096.1; __utmb=111542813.0.10.1703245096; __utmc=111542813; __utmz=111542813.1703245096.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga_Z4XZQNBBYD=GS1.1.1703245095.1.0.1703245095.0.0.0; _ga=GA1.1.598630111.1703245096';

let options = {
	method: 'get',
	url: url,
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
		Cookie: over18 == 'true' ? cookies + ' over18=1;' : cookies,
	},
	validateStatus: function (status) {
		return status < 500; // Resolve only if the status code is less than 500
	},
};

//axios will run as normal and log its output for the fork process to read
axios
	.request(options)
	.then(async function (response) {
		//remove script tags and content
		let cleanHtml = response.data;
		let x = 0;
		let json = {
			status: response.status,
			url: response.config.url,
			actualUrl: response.request.res.responseUrl,
		};
		let clean = true;
		try {
			var temp =
				cleanHtml.substring(0, cleanHtml.match(/<head/).index) +
				cleanHtml.substring(
					cleanHtml.match(/<\/head>/).index + '</head>'.length,
					cleanHtml.length,
				);
			cleanHtml = temp;
		} catch (e) {
			// console.error('Error: Header not Removed \n', e);
		}
		try {
			while (cleanHtml.includes('<style')) {
				x++;
				//Screams in pain
				var temp =
					cleanHtml.substring(0, cleanHtml.match(/<style/).index) +
					cleanHtml.substring(
						cleanHtml.match(/<\/style>/).index + '</style>'.length,
						cleanHtml.length,
					);
				cleanHtml = temp;
				if (x == 500) {
					// console.error('500s cycle reached. Break');
					break;
				}
			}
		} catch (e) {
			// console.error('Error:style not removed \n', e);
		}

		try {
			while (cleanHtml.includes('<script')) {
				x++;
				//Screams in pain
				var temp =
					cleanHtml.substring(0, cleanHtml.match(/<script/).index) +
					cleanHtml.substring(
						cleanHtml.match(/<\/script>/).index + '</script>'.length,
						cleanHtml.length,
					);
				cleanHtml = temp;
				if (x == 500) {
					// console.error('500s cycle reached. Break');
					break;
				}
			}
		} catch (e) {
			// console.error('Error:Scripts not removed \n', e);
			clean = false;
		}
		if (clean) json['response'] = cleanHtml;
		else json['response'] = response.data;

		json['cycles'] = x;
		logJson(json);
		return;
	})
	.catch(function (err) {
		logJson({ Error: 'bad stuff happened', err });
		return;
	});

function logJson(json) {
	console.log(JSON.stringify(json));
}
