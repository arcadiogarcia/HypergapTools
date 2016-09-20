// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');
var newProject = require('./newProject.js');
var os = require('os');
var spawn = require('child_process').spawn;
const exec = require('child_process').exec;
var xml2js = require('xml2js');
var xmlparser = new xml2js.Parser();
var serverPort = 3000;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var creatingNewProject = false;

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hypergap-tools" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable1 = vscode.commands.registerCommand('extension.createProject', function () {
        creatingNewProject = true;
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
                localServer.setDeployPackage(packagePath);
                const opn = require('opn');
                opn("com.hypergap.deploy://" + "localhost:" + serverPort + "/deployPackage");
            }
        }
    });

    var disposable4 = vscode.commands.registerCommand('extension.openLevelEditor', function () {
        // The code you place here will be executed every time your command is executed
        var thisExtension = vscode.extensions.getExtension('ArcadioGarcia.hypergap-tools');
        var child = exec(thisExtension.extensionPath+"\\node_modules\\.bin\\electron "+thisExtension.extensionPath +'\\electronApp\\');
        // var child = spawn(thisExtension.extensionPath + "/electronApp/hypergaptools-electron-component-win32-ia32/hypergaptools-electron-component.exe");
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
                child.stdin.write('Copy-Item "' + vscode.workspace.rootPath + '/manifest.json" "' + vscode.workspace.rootPath + '/HypergapPackageTemp" \n');
                child.stdin.write('Copy-Item "' + vscode.workspace.rootPath + '/' + manifest.scope + '" "' + vscode.workspace.rootPath + '/HypergapPackageTemp" -Recurse\n');
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

    function readManifest(safeMode) {
        try {
            var manifest = require(vscode.workspace.rootPath + '/manifest.json');
        } catch (e) {
            if (!safeMode && creatingNewProject == false) {
                vscode.window.showErrorMessage("There is no HyperGap project in this folder! (manifest.json is missing)");
                vscode.window.showErrorMessage("If you want to create a new HyperGap game, run 'Create HyperGap project'");
            }
            return null;
        }
        return manifest;
    }

    var localServer = (function () {
        var app = null;
        var server = null;
        var file = null;
        var express = require('express');

        app = express();
        var server = require('http').Server(app);

        app.get('/deployPackage', function (req, res) {
            res.sendFile(file);
        });

        server.listen(serverPort);

        var io = require('socket.io')(server);


        var HYPERGAP = {};
        var presetToSpritesheet = {};

        HYPERGAP.presets = [];
        HYPERGAP.presets.push = function (x) {
            HYPERGAP.presets = HYPERGAP.presets.concat(x);
        }
        var manifest = readManifest(true);
        if (manifest) {
            manifest.presets.asyncForEach(function (x, cb) {
                fs.readFile(vscode.workspace.rootPath + "/" + manifest.scope + "/" + x, function (err, script) {
                    eval(script.toString());//I know, I know
                    cb();
                });
            }, function () {
                HYPERGAP.presets.forEach(function (x) {
                    presetToSpritesheet[x.name] = x.sprite;
                    if(x.inherits){
                        if (x.inherits.forEach){
                            x.inherits.forEach(function(parent){
                                presetToSpritesheet[x.name] = presetToSpritesheet[x.name] || presetToSpritesheet[parent];
                            })
                        }else{
                            presetToSpritesheet[x.name]=presetToSpritesheet[x.inherits];
                        }
                    }
                })
            });
        }



        io.on('connection', function (socket) {   
            socket.on('save', function (data) {
                switch (data.content) {
                    case "level":
                        var levelContent=JSON.parse(data.levelContent);
                        var manifest = readManifest();
                        fs.readFile(vscode.workspace.rootPath + '/' + manifest.scope + '/' + data.file, function (err, xmldata) {
                            xmlparser.parseString(xmldata, function (err, result) {
                                result.levels.level.forEach(function (x) { if (x.$.id == data.level){
                                    x.object=levelContent.map(function(o){
                                        var vars={};
                                        for( k in o){
                                            if(k[0]=="#"){continue;}
                                            vars[k]=o[k];
                                        };
                                        return {$:{
                                            name:o["#name"],
                                            type:o["#preset"],
                                            x:o["#x"],
                                            y:o["#y"],
                                            z:o["#z"]||0,
                                            vars:JSON.stringify(vars)
                                        }}
                                    });
                                }
                            });
                            var builder = new xml2js.Builder();
                            var xml = builder.buildObject(result);
                            fs.writeFile(vscode.workspace.rootPath + '/' + manifest.scope + '/' + data.file, xml,function (err) {
                                if(!err){
                                  socket.emit('reply', { id: data.id, payload: "OK" });
                                }else{
                                  socket.emit('reply', { id: data.id, payload: err });  
                                }
                            });
                            });
                        });
                        break;
                    }
            });
            socket.on('get', function (data) {
                switch (data.content) {
                    case "scope":
                        var manifest = readManifest();
                        socket.emit('reply', { id: data.id, payload: vscode.workspace.rootPath + '/' + manifest.scope + '/' });
                        break;
                    case "gameconfig":
                        var manifest = readManifest();
                        socket.emit('reply', {
                            id: data.id, payload: {
                                width: manifest.screenResolution.w,
                                height: manifest.screenResolution.h,
                                enginefps: manifest.enginefps,
                                animationfps: manifest.animationfps
                            }
                        });
                        break;
                    case "levelFiles":
                        var manifest = readManifest();
                        socket.emit('reply', { id: data.id, payload: manifest.levels });
                        break;
                    case "levels":
                        var manifest = readManifest();
                        fs.readFile(vscode.workspace.rootPath + '/' + manifest.scope + '/' + data.file, function (err, xmldata) {
                            xmlparser.parseString(xmldata, function (err, result) {
                                socket.emit('reply', { id: data.id, payload: result.levels.level.map(function (x) { return x.$.id }) });
                            });
                        });
                        break;
                    case "levelContent":
                        var manifest = readManifest();
                        fs.readFile(vscode.workspace.rootPath + '/' + manifest.scope + '/' + data.file, function (err, xmldata) {
                            xmlparser.parseString(xmldata, function (err, result) {
                                var levelContent = (result.levels.level.filter(function (x) { return x.$.id == data.level })[0].object || []).map(function (x) { return x.$ });
                                socket.emit('reply', {
                                    id: data.id, payload: levelContent.map(function (x) {
                                        x.spritesheet = presetToSpritesheet[x.type];
                                        return x;
                                    })
                                });
                            });
                        });
                        break;
                    case "spritesheets":
                        var manifest = readManifest();
                        socket.emit('reply', { id: data.id, payload: manifest.spritesheets });
                        break;
                    case "presets":
                        var manifest = readManifest();
                        socket.emit('reply', { id: data.id, payload: presetToSpritesheet });
                        break;
                    default:
                        console.log(data.content)
                }
            });
        });

        return {
            setDeployPackage: function (someFile) {
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


//Useful when you need to perform async operations on each of the elements of an array, but in strict order, and execute a callback at the end
Object.defineProperty(Array.prototype, 'asyncForEach', {
    enumerable: false,
    value: function (action, cb, index) {
        var i = index || 0;
        if (i >= this.length) {
            return cb();
        }
        var that = this;
        return action(this[i], function () { that.asyncForEach(action, cb, i + 1); });
    }
});