const axios = require('axios');

const { r, params, over18 } = JSON.parse(process.argv[2]);
if (r == undefined || params == undefined || over18 == undefined)
	return { Error: 'Make sure r, params and over18 are present when calling the fuction' };
const cookies =
	'loid=000000000cpgoyl63y.2.1685878453258.Z0FBQUFBQmtmSGExaHc2eXdhVUdxTzlKOWd6eDFTbVlzQm83Q0phaVZFNDRYbDlRT251ZVdoaTRNeGp3ZTdHVGRDY1FKemxabU1hNjVnM0ZZSTlISWxBNVBDTV80SG5yMnlXYng1VDBjYVJXUTZyZEpzYk5ndEpVbExjWFRZR3I0ZUl5M3Q2b3NCbDI; csv=2; edgebucket=bbyF2yJ3R9wntuDxoJ; pc=n8; session_tracker=kqppcgrjanlqbiddlb.0.1685878576205.Z0FBQUFBQmtmSGN3dTUwZzA0RU9zM1BJaklkSUljLWg3TkxvXzZIQXpwUkNackZDYkptTTl6OEFMbndVOUhGMzRTTVNmNmhaVzZyMzJMZjdSU09GaUNSTjVPT3VSejZTbF91c1ZSN1R3T0RTcXJsYk1FUmZzdWRDck8zdmptWjY5TXh2dURHTFdkLUk';

let options = {
	method: 'get',
	url: `https://old.reddit.com/${r}${params}`,
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
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
		// console.log(response);
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
					// console.log('500s cycle reached. Break');
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
					// console.log('500s cycle reached. Break');
					break;
				}
			}
		} catch (e) {
			// console.error('Error:Scripts not removed \n', e);
			clean = false;
		}
		if (clean) json['html'] = cleanHtml;
		else json['html'] = response.data;

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
