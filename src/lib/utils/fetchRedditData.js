export async function fetchRedditData(subName, nextSet) {

	return await fetch('/api', {
		method: 'POST',
		body: JSON.stringify({
			r: subName,
			params: nextSet,
      over18: localStorage.over18,
		}),
		headers: {
			'content-type': 'application/json',
		},
	})
		.then((r) => {return r.json()})
		.then((json) => {
			if (json.html == undefined) {
				console.log(json);
				return { error: 'bad stuff happened' };
			}
      console.log(json);
      if(json.url.includes('com/over18')){
        return notOver18();
      }
			switch (json.status) {
				case 200:
					return reddit200(json.html);
				case 403:
					return reddit403(json.html);
				case 404:
					return reddit404(json.html);
			}
		});
}
//needs to refactor to fall more in line with 403
function reddit200(html) {
	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = html;
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
  if(returnArr.length==0 && htmlDoc.querySelectorAll('#noresults'))
    return subNotFound();
  
	return returnArr;
}

function reddit403(html) {
	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = html;
	const message = htmlDoc.querySelector('.md');
	const retunrObj = {
		status: 403,
		message: [
			message.querySelector('h3').textContent,
			message.querySelector('div h5').textContent,
			...[...htmlDoc.querySelectorAll('div.md > div > p')].map((e) => e.textContent),
		],
	};
	return retunrObj;
}

function reddit404(html) {
	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = html;
	const message = htmlDoc.querySelector('.pagename').textContent;
	const retunrObj = {
		status: 404,
		message: [message, 'The requested page was not found', ['']],
	};
	return retunrObj;
}

function notOver18(){
  const retunrObj = {
		status: 403,
		message: [
			"Forbidden",
			"The content on this page is for adults only",
			["You can enable this content by right clicking allowing Over 18 Content"],
		],
	};
	return retunrObj;
}

function subNotFound(){
  const retunrObj = {
		status: 403,
		message: [
			"Not Found",
			"The requested forum was not found",
			["Please verify your spelling and that forum exists"],
		],
	};
	return retunrObj;
}