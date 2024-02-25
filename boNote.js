// Besoin par defaut.
const vscode = require('vscode') ;
const fs     = require('fs') ;
const path   = require('path') ;
 
const boNote = function(context) {
 
    // =================================================
    //   W   W  EEEEE  BBBB   V   V  III  EEEEE  W   W
    //   W   W  E      B   B  V   V   I   E      W   W
    //   W W W  EEEE   BBBB   V   V   I   EEEE   W W W
    //   W W W  E      B   B   V V    I   E      W W W
    //    W W   EEEEE  BBBB     V    III  EEEEE   W W
    // =================================================
    // * * * WebView
    class ZeWebViewPanel {
        constructor(_extensionUri) {
            this._extensionUri  = _extensionUri ;
        }
        resolveWebviewView(webviewView, context, _token) {
            this._view = webviewView;
            webviewView.webview.options = {
                // Allow scripts in the webview
                enableScripts: true,
                localResourceRoots: [
                    this._extensionUri
                ]
            };
            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
            webviewView.webview.onDidReceiveMessage(msg => {
                if(msg.action == 'cmd') {
                    vscode.commands.executeCommand(msg.valeur)
                }
                if(msg.action == 'mail') {
                    vscode.env.openExternal('mailto:'+msg.valeur)
                }
                if(msg.action == 'url') {
                    vscode.env.openExternal(msg.valeur)
                }
            });
        }
        _getHtmlForWebview(webview) {
            let fichHTML = path.join(context.extensionPath, 'boNote.html') ;
            let contenuHTML = fs.readFileSync(fichHTML).toString() ;
            const CHEMIN = webview.asWebviewUri(vscode.Uri.file(context.extensionPath)) ;
            contenuHTML = contenuHTML.replaceAll('<chemin/>', CHEMIN) ;  
            return contenuHTML;
        }
    }
    ZeWebViewPanel.viewType = 'momaView';
 
    const lePanel = new ZeWebViewPanel(context.extensionUri, context.extensionPath);
 
    return lePanel ;
}

module.exports = {
	boNote
}

// * * * Fonction CLOG à regroupement * * *
function clog(...tb) {
    let deb = (tb.length > 1) ;
    for (let ob of tb){
        if(deb) { console.groupCollapsed(ob) ; deb = false ;}
        else    { console.log(ob) ; }
    }   if(tb.length > 1) console.groupEnd() ;
}