export async function fetchRedditData(subName,nextSet) {

  return await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({
      r: subName,
      params: nextSet,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((r) => r.json())
    .then(json=>{
      if (json.html == undefined) {
        console.log(json);
        return { error: 'bad stuff happened' };
      }
      switch (json.status) {
        case 200:
          return reddit200(json.html);
        case 403:
          return reddit403(json.html);
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
      ...[...htmlDoc.querySelectorAll('div.md > div > p')].map(e=>e.textContent),
		],
	};
	console.log(retunrObj);
	return retunrObj;
}
