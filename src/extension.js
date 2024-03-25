
const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    const panelExt = require('./boNote.js') ;
    const provider = panelExt.boNote(context) ;
    context.subscriptions.push(
		  vscode.window.registerWebviewViewProvider('boNoteView', provider)
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('bonote.choixDossier', async function () {
        provider.setFolder() ;
    }));

    context.subscriptions.push(
      vscode.commands.registerCommand('bonote.creationFichier', async function () {
        provider.creationFichier() ;
    }));

    context.subscriptions.push(
      vscode.commands.registerCommand('bonote.ouvrirDossier', async function () {
        provider.ouvrirDossierVsCode() ;
    }));
    
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// * Routines *
function clog(...tb) {
  let deb = (tb.length > 1) ;
  for (let ob of tb){
      if(deb) { console.groupCollapsed(ob) ; deb = false ;}
      else    { console.log(ob) ; }
  }   if(tb.length > 1) console.groupEnd() ;
}