export async function fetchRedditData(url) {
  const html = await fetch("https://old.reddit.com/" + url)
    .then(r =>{
      if (r.ok) {
        return r.text();
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
            cleanHtml.match(/<\/head>/).index + "</head>".length,
            cleanHtml.length
          );
        cleanHtml = temp;
      } catch (e) {
        console.error(e);
        console.log("Error: Header not Removed");
      }
      try {
        while (cleanHtml.includes("<style")) {
          x++;
          //Screams in pain
          var temp =
            cleanHtml.substring(0, cleanHtml.match(/<style/).index) +
            cleanHtml.substring(
              cleanHtml.match(/<\/style>/).index + "</style>".length,
              cleanHtml.length
            );
          cleanHtml = temp;
          if (x == 500) {
            console.log("500s cycle reached. Break");
            break;
          }
        }
      } catch (e) {
        console.log("Error:style not removed");
      }

      try {
        while (cleanHtml.includes("<script")) {
          x++;
          //Screams in pain
          var temp =
            cleanHtml.substring(0, cleanHtml.match(/<script/).index) +
            cleanHtml.substring(
              cleanHtml.match(/<\/script>/).index + "</script>".length,
              cleanHtml.length
            );
          cleanHtml = temp;
          if (x == 500) {
            console.log("500s cycle reached. Break");
            break;
          }
        }
      } catch (e) {
        console.log("Error:Scripts not removed");
        clean = true;
      }
      if (!clean) {
        json["html"] = html.data;
      } else {
        json["html"] = cleanHtml;
      }
      json["cycles"] = x;
      return json;
    })
    .catch(function (err) {
      console.log("ERROR:");
      console.log(err);
      return { error: "bad stuff happened" };
    });
  
  if(html.html==undefined){
    return { error: "bad stuff happened" };
  }

  // res.send(html);
  const htmlDoc = document.createElement("html");
  htmlDoc.innerHTML = html.html;
  const things = htmlDoc.querySelectorAll('.thing:not(.promoted)');
  const returnArr = [];
  for (var x of things) {
    let expandoReturn = "";
    const expando = x.querySelectorAll('.expando');
    if (expando.length)
      if (expando[0].getAttributeNames().includes("data-cachedhtml"))
        expandoReturn = expando[0].getAttribute('data-cachedhtml');
      else
        expandoReturn = expando[0].outerHTML;
    else
      expandoReturn = x.getAttribute('data-url');

    let expandoType = "none";
    const expandoTypeEle = x.querySelectorAll('.entry .expando-button');

    if (expandoTypeEle.length)
      if (expandoTypeEle[0].classList.contains('video'))
        expandoType = "media";
      else if (expandoTypeEle[0].classList.contains('selftext'))
        expandoType = "text";


    returnArr.push({
      "thingID": x.getAttribute('data-fullname'),
      "thingDomain": x.getAttribute('data-domain'),
      "title": x.querySelector('a.title') ? x.querySelector('a.title').textContent : "",
      "href": x.querySelector('.flat-list .comments') ? x.querySelector('.flat-list .comments').href : "",
      "comments": x.querySelector('.flat-list .comments') ? x.querySelector('.flat-list .comments').textContent : "",
      "author": x.querySelector('.tagline .author') ? x.querySelector('.tagline .author').textContent : "",
      "time": x.querySelector('.tagline time') ? x.querySelector('.tagline time').textContent : "",
      "subreddit": x.getAttribute('data-subreddit-prefixed'),
      "expando": expandoReturn,
      "expandoType": expandoType,
      "raw": x.outerHTML
    })
  }
  return returnArr;
}