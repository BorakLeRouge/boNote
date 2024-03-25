// Besoin par defaut.
const vscode = require('vscode') ;
const fs     = require('fs') ;
const path   = require('path') ;
 

 
// =================================================
//   W   W  EEEEE  BBBB   V   V  III  EEEEE  W   W
//   W   W  E      B   B  V   V   I   E      W   W
//   W W W  EEEE   BBBB   V   V   I   EEEE   W W W
//   W W W  E      B   B   V V    I   E      W W W
//    W W   EEEEE  BBBB     V    III  EEEEE   W W
// =================================================
// * * * WebView

const boNote = function(context) {

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
                clog('Message ' + msg.action, msg)
                if(msg.action == '1er Affichage') {
                    PreparationAffichage(context, webviewView.webview) ;
                }
                if(msg.action == 'ouvrirFichier') {
                    ouvrirFichier(context, webviewView.webview, msg.contenu) ;
                }
                if(msg.action == 'ouvrirDossier') {
                    ouvrirDossier(context, webviewView.webview) ;
                }
                if(msg.action == 'choisirDossier') {
                    choisirDossier(context, webviewView.webview) ;
                }
                if(msg.action == 'actualiser') {
                    PreparationAffichage(context, webviewView.webview) ;
                }
            });
        }
        _getHtmlForWebview(webview) {
            let fichHTML = path.join(context.extensionPath, 'src', 'boNote.html') ;
            let contenuHTML = fs.readFileSync(fichHTML).toString() ;
            const CHEMIN = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src'))) ;
            contenuHTML = contenuHTML.replaceAll('<chemin/>', CHEMIN) ;  
            return contenuHTML;
        }
        
        setFolder() {
            clog('coucou 2') ;
        }

        getWebview() {
            return this._view ;
        }
        
    }
    ZeWebViewPanel.viewType = 'boNoteView';
 
    const lePanel = new ZeWebViewPanel(context.extensionUri, context.extensionPath);

    return lePanel ;
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
async function PreparationAffichage(context, webview, dossierInit = '') {
    let leDossier ;
    if (dossierInit != '') { 
        leDossier = dossierInit ;
    } else {
        leDossier = vscode.workspace.getConfiguration('boNote').boNoteFolder ;  
    }
    if (fs.existsSync(leDossier)) {
        try {
            let contenuDossier = fs.readdirSync(path.join(leDossier)) ;
            contenuDossier.sort() ;
            let html = '<ul>' ;
            let prec = '' ;
            for(let lignFich of contenuDossier) {
                if(lignFich.substring(0,1) == '.') { continue ; }
                let deb = lignFich.substring(0,3) ;
                if (prec != '' && deb != prec) {
                    html += '</ul><ul>' ; 
                }
                prec = deb ;
                let dispName = lignFich.replace('.txt', '').replace('.text', '').replace('.md', '').replace('.css', '').replace('.html', '').replace('.js', '') ;
                dispName = dispName.replace('.png','').replace('.gif','').replace('.jpg','') ;
                html += '<li><a class="link" href="javascript:void(0)" onclick="ouvrirFichier(\''+lignFich+'\')" title="'+lignFich+'">' + dispName + '</a></li>' ;
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
    } else {
        let html = '<p><a class="link" href="javascript:void(0)" onclick="choisirDossier()" title="Choisir un dossier de stockage...">Choisir le dossier de stockage</a></p>' ;
        webview.postMessage({
            action: 'affichage',
            contenu: html
        }) ;
    }
}



// ================================================
//    A     CCC   TTTTT  III   OOO   N   N   SSS
//   A A   C   C    T     I   O   O  NN  N  S
//  A   A  C        T     I   O   O  N N N   SSS
//  AAAAA  C        T     I   O   O  N  NN      S
//  A   A  C   C    T     I   O   O  N   N      S
//  A   A   CCC     T    III   OOO   N   N  SSSS
// ================================================
// * * * Actions à traiter

async function ouvrirFichier(context, webview, fichier) {
    let leDossier = vscode.workspace.getConfiguration('boNote').boNoteFolder ;
    let leFich    = path.join(leDossier, fichier) ;
    if (fs.existsSync(leFich)) {
        let uri = vscode.Uri.file(leFich) ;
        vscode.commands.executeCommand('vscode.open', uri) ;
    } else {
        vscode.window.showErrorMessage("Le fichier n'est plus présent") ;
    }
}

async function ouvrirDossier(context, webview) {
    let leDossier = vscode.workspace.getConfiguration('boNote').boNoteFolder ;
    let leFich    = path.join(leDossier, 'src') ;
    if (leDossier != undefined && leDossier.trim() != '' && fs.existsSync(leFich)) {
        let uri = vscode.Uri.file(leFich) ;
        vscode.commands.executeCommand('vscode.openFolder', uri, {forceNewWindow: true}) ;
    } else {
        choisirDossier(context, webview) ;
    }
}

async function choisirDossier(context, webview) {

    const OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Choisir Dossier',
        canSelectFiles: false,
        canSelectFolders: true
    };
   
    vscode.window.showOpenDialog(OpenDialogOptions).then(fileUri => {
        if (fileUri && fileUri[0]) {
            let leDossier = fileUri[0].fsPath ;
            console.log('Selected file: ' + fileUri[0].fsPath);
            if (fs.existsSync(leDossier)) {
                // Dossier sélectionné
                vscode.workspace.getConfiguration('boNote').update('boNoteFolder', leDossier, true) ;
                PreparationAffichage(context, webview, leDossier) ;
            }
        } else {
            vscode.window.showInformationMessage('Pas de dossier selectionné !') ;
        }
    });

}




module.exports = {
	boNote
}

// =======================================================
//  RRRR    OOO   U   U  TTTTT  III  N   N  EEEEE   SSS
//  R   R  O   O  U   U    T     I   NN  N  E      S
//  R   R  O   O  U   U    T     I   N N N  EEE     SSS
//  RRRR   O   O  U   U    T     I   N  NN  E          S
//  R  R   O   O  U   U    T     I   N   N  E          S
//  R   R   OOO    UUU     T    III  N   N  EEEEE  SSSS
// =======================================================
// * * * Routines

// * * * Fonction CLOG à regroupement * * *
function clog(...tb) {
    let deb = (tb.length > 1) ;
    for (let ob of tb){
        if(deb) { console.groupCollapsed(ob) ; deb = false ;}
        else    { console.log(ob) ; }
    }   if(tb.length > 1) console.groupEnd() ;
}