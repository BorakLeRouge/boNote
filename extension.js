
const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    const panelExt = require('./boNote.js') ;
    const provider   = panelExt.boNote(context) ;
    context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('boNoteView', provider)
    );

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
