export async function fetchRedditData(url) {
	let status;
	const html = await fetch('https://old.reddit.com/' + url,{credentials:"include"})
		.then((r) => {
			status = r.status;
			switch (r.status) {
				case 200:
					return r.text();
				case 403:
					return r.text();
				case 404:
					console.log('sub not found');
					break;
			}
		})
		.then((html) => {
			//success!
			//remove script tags and content
			let cleanHtml = html;
			let x = 0;
			let json = {};
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
				console.error(e);
				console.log('Error: Header not Removed');
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
						console.log('500s cycle reached. Break');
						break;
					}
				}
			} catch (e) {
				console.log('Error:style not removed');
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
						console.log('500s cycle reached. Break');
						break;
					}
				}
			} catch (e) {
				console.log('Error:Scripts not removed');
				clean = true;
			}
			if (!clean) {
				json['html'] = html.data;
			} else {
				json['html'] = cleanHtml;
			}
			json['cycles'] = x;
			return json;
		})
		.catch(function (err) {
			console.log('ERROR:');
			console.log(err);
			return { error: 'bad stuff happened' };
		});

	if (html.html == undefined) {
		console.log(html);
		return { error: 'bad stuff happened' };
	}

	// res.send(html);
	switch (status) {
		case 200:
			return reddit200(html);
		case 403:
			return reddit403(html);
	}
}
//needs to refactor to fall more in line with 403
function reddit200(html) {
	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = html.html;
	const things = htmlDoc.querySelectorAll('.thing:not(.promoted)');
	const returnArr = [];
	for (var x of things) {
		let expandoReturn = '';
		const expando = x.querySelectorAll('.expando');
		if (expando.length)
			if (expando[0].getAttributeNames().includes('data-cachedhtml'))
				expandoReturn = expando[0].getAttribute('data-cachedhtml');
			else expandoReturn = expando[0].outerHTML;
		else expandoReturn = x.getAttribute('data-url');

		let expandoType = 'none';
		const expandoTypeEle = x.querySelectorAll('.entry .expando-button');

		if (expandoTypeEle.length)
			if (expandoTypeEle[0].classList.contains('video')) expandoType = 'media';
			else if (expandoTypeEle[0].classList.contains('selftext')) expandoType = 'text';
      else if (expandoTypeEle[0].classList.contains('crosspost')) expandoType = 'crossPost';

		returnArr.push({
			thingID: x.getAttribute('data-fullname'),
			thingDomain: x.getAttribute('data-domain'),
			title: x.querySelector('a.title') ? x.querySelector('a.title').textContent : '',
			href: x.querySelector('.flat-list .comments')
				? x.querySelector('.flat-list .comments').href
				: '',
			comments: x.querySelector('.flat-list .comments')
				? x.querySelector('.flat-list .comments').textContent
				: '',
			author: x.querySelector('.tagline .author')
				? x.querySelector('.tagline .author').textContent
				: '',
			time: x.querySelector('.tagline time')
				? x.querySelector('.tagline time').textContent
				: '',
			subreddit: x.getAttribute('data-subreddit-prefixed'),
			expando: expandoReturn,
			expandoType: expandoType,
			raw: x.outerHTML,
		});
	}
	return returnArr;
}

function reddit403(html) {
	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = html.html;
	const message = htmlDoc.querySelector('.md');
	const retunrObj = {
		status: 403,
		message: [
			message.querySelector('h3').textContent,
			message.querySelector('div h5').textContent,
      ...[...htmlDoc.querySelectorAll('div.md > div > p')].map(e=>e.textContent),
		],
	};
	console.log(retunrObj);
	return retunrObj;
}
