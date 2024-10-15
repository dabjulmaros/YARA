const axios = require('axios');

const { url, over18 } = JSON.parse(process.argv[2]);
if (url == undefined || over18 == undefined)
  return logJson({ Error: 'Make sure url and over18 are present when calling the function' });
const cookies =
  'loid=00000000128hd8znb0.2.1718073061503.Z0FBQUFBQm1aN2JtenFsLWxhdmswNlNtZVBiWWFqSGhVV1VPVHZaQlAzYnJRT0U0UV9kaXNGWFNYeWh1VXRpUkF4VWhUaXFIOVo3Zm1tY2dkVGtOQWtOMFNCd2JKUS1Da25CMURORGRhZ0djMVpDWEEtQUIzTzlkOGdhczd0RXdyVnE2dXZTMkJLN0M; session_tracker=fhjpbcrlanrnfkfrai.0.1718073107684.Z0FBQUFBQm1aN2NVbDFZc0c0OHh2NDhyRnJ0c0lXeU1yRVBLVTFFUHlVVmtibGVKWU00LWZZcmxXWjRwV3dUTTQ1WU5iY1JfT3pvU2dqNDdwYkZCbVc1T1c5YWNnV25MWTNxWUdDOHFPc285Vmx3MDhhOHVla091dlNkSHBHenkyeGpfVGZNTEpLaWc; csv=2; edgebucket=NlI3VeyNgs9dGEMzNm; _recentclicks2=t3_hx7x5m%2Ct3_zzp3dl%2C; pc=ul;';

let options = {
  method: 'get',
  url: url,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 OPR/113.0.0.0',
    Cookie: over18 == 'true' ? cookies + ' over18=1;' : cookies,
    Referer: url
  },
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  },
};

// if (url.includes('localhost:1234/')) {
//   // console.log(url);
//   options.headers["authority'"] = url.split('://')[1].split('/')[0];
//   options.headers["Referer'"] = "*/*";
//   options.headers["accept'"] = url;
//   options.headers["accept-encoding'"] = "identity;q=1, *;q=0";
// }
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
