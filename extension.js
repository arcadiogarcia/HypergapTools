// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hypergap-tools" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable1 = vscode.commands.registerCommand('extension.createProject', function () {
        // The code you place here will be executed every time your command is executed
        fs.closeSync(fs.openSync(vscode.workspace.rootPath + "/package.json", 'w'));
        emptyProject.forEach(file => {
            fs.writeFile(vscode.workspace.rootPath+"/"+file.name, file.content, function (err) {
                if (err) throw err;
            });
        });

        // Display a message box to the user
        vscode.window.showInformationMessage('Project created!');
    });

    var disposable2 = vscode.commands.registerCommand('extension.generatePackage', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Package generated!');
    });

    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

var emptyProject = [
    { name: "manifest.json", content: "test" }
];