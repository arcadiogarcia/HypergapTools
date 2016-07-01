// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');
var newProject = require('./newProject.js');
var os = require('os');
var spawn = require('child_process').spawn;
const exec = require('child_process').exec;
var serverPort=3000;

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
        vscode.window.showInputBox({ placeHolder: "Game name", prompt: "Write a name for your game:" }).then(projectName => {
            // fs.closeSync(fs.openSync(vscode.workspace.rootPath + "/package.json", 'w'));
            // fs.mkdirSync(vscode.workspace.rootPath + "/gameFiles");
            function createFolder(path, folder) {
                path = path + "/" + folder.name;
                try {
                    fs.mkdirSync(vscode.workspace.rootPath + path);
                } catch (e) {

                }
                if (folder.folders) {
                    folder.folders.forEach(createFolder.bind(null, path));
                }
            }
            newProject.folders.forEach(createFolder.bind(null, ""));
            newProject.files.forEach(file => {
                if (file.content) {
                    var content = file.content.replace("#projectName#", projectName);
                    fs.writeFile(vscode.workspace.rootPath + "/" + file.name, content, function (err) {
                        if (err) throw err;
                    });
                } else {
                    var thisExtension = vscode.extensions.getExtension('ArcadioGarcia.hypergap-tools');
                    fs.readFile(thisExtension.extensionPath + "/" + file.file, 'base64', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        fs.writeFile(vscode.workspace.rootPath + "/" + file.name, data, 'base64', function (err) {
                            if (err) throw err;
                        });
                    });
                }
            });
        })

        // Display a message box to the user
        vscode.window.showInformationMessage('Project created!');
    });

    var disposable2 = vscode.commands.registerCommand('extension.generatePackage', function () {
        // The code you place here will be executed every time your command is executed
        var manifest = readManifest();
        if (manifest != null) {
            generatePackage(manifest);
            vscode.window.showInformationMessage('Package generated!');
            return true;
        }
    });

    var disposable3 = vscode.commands.registerCommand('extension.deployPackage', function () {
        // The code you place here will be executed every time your command is executed
        var manifest = readManifest();
        if (manifest != null) {
            var packagePath = generatePackage(manifest);
            if (packagePath !== false) {
                setDeployPackage(packagePath);
                const opn = require('opn');
                opn("com.hypergap.deploy://" + "localhost:"+serverPort+"/deployPackage");
            }
        }
    });

    var disposable4 = vscode.commands.registerCommand('extension.openLevelEditor', function () {
        // The code you place here will be executed every time your command is executed
        var thisExtension=vscode.extensions.getExtension('ArcadioGarcia.hypergap-tools');
        var child = spawn(thisExtension.extensionPath+"/electronApp/hypergaptools-electron-component-win32-ia32/hypergaptools-electron-component.exe");
    });


    function generatePackage(manifest) {
        switch (os.type()) {
            case "Windows_NT":
                var results = [];
                var spawn = require("child_process").spawn;
                var child = spawn("powershell.exe", ["-Command", "-"]);
                child.stdout.on("data", function (data) {
                    console.log(data.toString());
                });
                child.stderr.on("data", function (data) {
                    console.log(data.toString());
                });
                child.stdin.write('mkdir "' + vscode.workspace.rootPath + '\\HypergapPackageTemp" \n');
                child.stdin.write('Copy-Item ' + vscode.workspace.rootPath + '/manifest.json ' + vscode.workspace.rootPath + '/HypergapPackageTemp \n');
                child.stdin.write('Copy-Item ' + vscode.workspace.rootPath + '/' + manifest.scope + ' ' + vscode.workspace.rootPath + '/HypergapPackageTemp -Recurse\n');
                child.stdin.write('Add-Type -A System.IO.Compression.FileSystem\n');
                child.stdin.write('Remove-Item "' + vscode.workspace.rootPath + '\\' + manifest.name + '.hgp" \n');
                child.stdin.write("[IO.Compression.ZipFile]::CreateFromDirectory('" + vscode.workspace.rootPath + "/HypergapPackageTemp', '" + vscode.workspace.rootPath + "/" + manifest.name + ".hgp')\n");
                child.stdin.write('Remove-Item "' + vscode.workspace.rootPath + '\\HypergapPackageTemp"-recurse\n');
                child.stdin.end();
                return vscode.workspace.rootPath + "/" + manifest.name + ".hgp";
            default:
                vscode.window.showErrorMessage("This OS is not supported");
                return false;
        }
    }

    function readManifest() {
        try {
            var manifest = require(vscode.workspace.rootPath + '/manifest.json');
        } catch (e) {
            vscode.window.showErrorMessage("There is no HyperGap project in this folder! (manifest.json is missing)");
            vscode.window.showErrorMessage("If you want to create a new HyperGap game, run 'Create HyperGap project'");
            return null;
        }
        return manifest;
    }

    var localServer = (function () {
        var app = null;
        var server = null;
        var file = null;
        var express = require('express');
        if (server != null) {
            server.close();
        }
        app = express();

        app.get('/deployPackage', function (req, res) {
            res.sendFile(file);
        });

        server = app.listen(serverPort, function () {

        });
        return {
            setDeployPackage:function (someFile) {
                file = someFile;
            }
        }
    })();

    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(disposable3);
    context.subscriptions.push(disposable4);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;


