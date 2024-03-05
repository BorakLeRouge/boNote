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
                if(msg.action == '1er Affichage') {
                    PreparationAffichage(context, webviewView.webview) ;
                }
                if(msg.action == 'ouvrirFichier') {
                    ouvrirFichier(context, webviewView.webview, msg.contenu) ;
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

// =============================================================================================================
//  PPPP   RRRR   EEEEE  PPPP     A    RRRR          A    FFFFF  FFFFF  III   CCC   H   H    A     GGG   EEEEE
//  P   P  R   R  E      P   P   A A   R   R        A A   F      F       I   C   C  H   H   A A   G   G  E
//  P   P  R   R  EEE    P   P  A   A  R   R       A   A  FFF    FFF     I   C      HHHHH  A   A  G      EEE
//  PPPP   RRRR   E      PPPP   AAAAA  RRRR        AAAAA  F      F       I   C      H   H  AAAAA  G  GG  E
//  P      R  R   E      P      A   A  R  R        A   A  F      F       I   C   C  H   H  A   A  G   G  E
//  P      R   R  EEEEE  P      A   A  R   R       A   A  F      F      III   CCC   H   H  A   A   GGGG  EEEEE
// =============================================================================================================
// * * * preparation de l'affichage
async function PreparationAffichage(context, webview) {
    let leDossier = vscode.workspace.getConfiguration('boNote').boNoteFolder ;
    try {
        contenuDossier = fs.readdirSync(path.join(leDossier)) ;
        let html = '<ul>'
        for(lignFich of contenuDossier) {
            html += '<li class="ouvFic" onclick="ouvrirFichier(\''+lignFich+'\')">' + lignFich + '</li>'
        }
        html += '</ul>'
        webview.postMessage({
            action: 'affichage',
            contenu: html
        })
    } catch(e) {
        vscode.window.showErrorMessage("Dossier BoNote introuvable : " + e.toString() )
        return
    }
}

async function ouvrirFichier(context, webview, fichier) {
    let leDossier = vscode.workspace.getConfiguration('boNote').boNoteFolder ;
    let leFich    = path.join(leDossier, fichier) ;
    let uri = vscode.Uri.file(leFich) ;
    vscode.commands.executeCommand('vscode.open', uri) ;
}

// * * * Fonction CLOG à regroupement * * *
function clog(...tb) {
    let deb = (tb.length > 1) ;
    for (let ob of tb){
        if(deb) { console.groupCollapsed(ob) ; deb = false ;}
        else    { console.log(ob) ; }
    }   if(tb.length > 1) console.groupEnd() ;
}