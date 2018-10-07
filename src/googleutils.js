import { clientId  } from './googleapikeys';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

function loadScript(url, callback){

  var script = document.createElement("script")
  script.type = "text/javascript";

  if (script.readyState){  //IE
      script.onreadystatechange = function(){
          if (script.readyState === "loaded" ||
                  script.readyState === "complete"){
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

class GoogleApiService {
  constructor(gapi) {
    this.gapi = gapi
  }
  get authInstance() {
    return this.gapi.auth2.getAuthInstance()
  }
  get drive() {
    return this.gapi.client.drive
  }
  get spreadsheets() {
    return this.gapi.client.sheets.spreadsheets
  }
}


function initAuthorization(gapi, resolve, reject) {
  function gapiLoaded() {
    gapi.client.init({
      clientId,
      scope: SCOPES,
      discoveryDocs: DISCOVERY_DOCS
    }).then(function () {
      resolve(new GoogleApiService(gapi))
    }, function(x) {
      reject(x)
    })
  }
  gapi.load('client:auth2', gapiLoaded)
}

export function initGoogle() {
  return new Promise(function(resolve, reject) {
    function scriptLoaded() {
      const gapi = window.gapi
      initAuthorization(gapi, resolve, reject)
    }
    loadScript('https://apis.google.com/js/api.js', scriptLoaded);
  })
}
