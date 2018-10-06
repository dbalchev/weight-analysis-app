// import {OAuth2Client}  from 'google-auth-library';
import { clientId, apiKey } from './googleapikeys';

// console.log(GoogleAuth)
const google = {}
// const google = GoogleApis();
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly';

const googleConfig = {
  clientId, 
  redirect:  window.location.href + '/logged'
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
// function createConnection() {
//   return new OAuth2Client(
//     googleConfig.clientId,
//     googleConfig.clientSecret,
//     googleConfig.redirect
//   );
// }

// export function authorize() {
//     const oAuth2Client = createConnection()
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//       });
//     return authUrl
// }

function loadScript(url, callback){

  var script = document.createElement("script")
  script.type = "text/javascript";

  if (script.readyState){  //IE
      script.onreadystatechange = function(){
          if (script.readyState == "loaded" ||
                  script.readyState == "complete"){
              script.onreadystatechange = null;
              callback();
          }
      };
  } else {  //Others
      script.onload = function(){
          callback();
      };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}


export function authorize() {
  return new Promise(function(resolve, reject) {
    function scriptLoaded() {
      const gapi = window.gapi
      function gapiLoaded() {
        console.log('loaded')
        gapi.client.init({
          apiKey,
          clientId,
          scope: SCOPES,
          discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
        }).then(function () {
          console.log('inited')
          const authInstance = gapi.auth2.getAuthInstance()
          console.log('authInstance', authInstance)
          resolve(gapi)
        }, function(x) {
          console.log(window.sessionStorage)
          console.log('failed!!', x)
        })
        console.log('init called')
      }
      console.log('loading auth')
      gapi.load('client:auth2', gapiLoaded)
    }
    loadScript('https://apis.google.com/js/api.js', scriptLoaded);
  })
}
