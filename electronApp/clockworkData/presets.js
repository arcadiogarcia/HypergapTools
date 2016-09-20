// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var editorPresets = [
    {
    name: "bg",
    sprite: "bg"
    },
{
    name: "object",
    sprite: "object",
    events:[{
        name:"#setup", code:function(event){
            this.engine.getAnimationEngine().setSpritesheet(this.spriteholder,this.getVar("#spritesheet"));
            this.setVar("#editor.moving",false);
            this.setCollider("hitbox", this.getVar("#boundingBox"));
        }
    },{
            name:"#collide",code:function(event){
                if(this.engine.getObject(event.object).instanceOf("basicMouse") && event.shape2id==1){
                    if(workspace.currentTool=="move"&&this.getVar("#editor.moving")==false){
                        
                        if(this.engine.getEngineVar("justSelectedSomething")!=true){
                            this.engine.setEngineVar("justSelectedSomething",true);
                            this.engine.setEngineVar("lastObject", this);
                            this.setVar("#editor.moving",true);
                            this.setVar("#editor.mx",this.engine.getObject(event.object).getVar("#x")-this.getVar("#x"));
                            this.setVar("#editor.my",this.engine.getObject(event.object).getVar("#y")-this.getVar("#y"));
                            this.engine.execute_event("showSelectBox",{type:"select", x:this.getVar("#x"),y:this.getVar("#y"),w:this.getVar("#boundingBox").w,h:this.getVar("#boundingBox").h,z:this.getVar("#z")-1});
                        }
                    }else{
                        this.engine.setEngineVar("justSelectedSomething",false);
                        this.setVar("#editor.moving",false);
                        this.engine.execute_event("hideSelectBox");
                    }
                    if(workspace.currentTool=="delete"){
                        this.engine.deleteObjectLive(this);
                        workspace.updateObjectList();
                    }
                    if(workspace.currentTool=="select"){
                        this.engine.setEngineVar("lastObject", this);
                        workspace.updateProperties();
                    }
                }
                if(this.engine.getObject(event.object).instanceOf("basicMouse") && event.shape2id==0){
                    if(this.getVar("#editor.moving")==true){
                        this.setVar("#x",this.engine.getObject(event.object).getVar("#x")-this.getVar("#editor.mx"));
                        this.setVar("#y",this.engine.getObject(event.object).getVar("#y")-this.getVar("#editor.my"));
                        this.engine.execute_event("showSelectBox",{type:"select", x:this.getVar("#x"),y:this.getVar("#y"),w:this.getVar("#boundingBox").w,h:this.getVar("#boundingBox").h,z:this.getVar("#z")-1});
                        workspace.updateMoveToolbar();
                    }else{
                        if(workspace.currentTool=="delete"){
                            this.engine.execute_event("showSelectBox",{type:"delete", x:this.getVar("#x"),y:this.getVar("#y"),w:this.getVar("#boundingBox").w,h:this.getVar("#boundingBox").h,z:this.getVar("#z")+1});
                        }else{
                            this.engine.execute_event("showSelectBox",{type:"hover", x:this.getVar("#x"),y:this.getVar("#y"),w:this.getVar("#boundingBox").w,h:this.getVar("#boundingBox").h,z:this.getVar("#z")-1});
                        }
                    }
                }
            }
        }],
    collision: {
        "box": [
            {"#tag":"hitbox", "x": 0, "y": 0, "w":100, "h":100 }
        ]
    }
},
{
    name: "infinityCanvas",
    events:[{
        name:"#collide",code:function(event){
                 if(this.engine.getObject(event.object).instanceOf("basicMouse") && event.shape2id==1){
                            if(workspace.currentTool=="new"){
                                var type=workspace.currentPreset;
                                var spritesheet=workspace.presetTable[type] || "objectWithNoSpritesheet";
                                var that=this;
                                setTimeout(function(){
                                    var boundingBox = that.engine.getAnimationEngine().getSpriteBox(spritesheet);
                                    that.engine.addObjectLive("something", "object",that.engine.getObject(event.object).getVar("#x"), that.engine.getObject(event.object).getVar("#y"), 0, false,false,{"#preset":type,"#spritesheet":spritesheet,"#boundingBox":boundingBox});
                                    workspace.updateObjectList();
                                },0);
                            }
                            if(workspace.currentTool=="moveCamera" && this.getVar("#editor.moving")!=true){
                                 this.setVar("#editor.moving",true);
                                 this.setVar("mouse",this.engine.getObject(event.object));
                                 var camera=this.engine.getAnimationEngine().getCamera();
                                this.setVar("#editor.mx",camera.x-this.engine.getObject(event.object).getVar("#x"));
                                this.setVar("#editor.my",camera.y-this.engine.getObject(event.object).getVar("#y"));
                            }
                }
        }
    },
    {
        name:"#loop",code:function(event){
                            if(workspace.currentTool=="moveCamera" && this.getVar("#editor.moving")==true){
                                var mouse=this.getVar("mouse");
                                this.engine.getAnimationEngine().setCamera(mouse.getVar("#x")+ this.getVar("#editor.mx"),mouse.getVar("#y")+ this.getVar("#editor.my"));
                                toolbars.setTextValue("xCamera",mouse.getVar("#x")+ this.getVar("#editor.mx"));
						        toolbars.setTextValue("yCamera",mouse.getVar("#y")+ this.getVar("#editor.my"));
                            }
                
        }
    },
    {
        name:"mouseup",code:function(event){
                            if(workspace.currentTool=="moveCamera" && this.getVar("#editor.moving")==true){
                                this.setVar("#editor.moving",false);
                            }
                
        }
    },
     {
        name:"setCamera",code:function(event){
            var camera=this.engine.getAnimationEngine().getCamera();
             this.engine.getAnimationEngine().setCamera(event.x||camera.x,event.y||camera.y);             
        }
    }],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w":Infinity, "h":Infinity }
        ]
    }
},
{
    name: "selectBox",
    sprite: "selectBox",
    events:[{
            name:"showSelectBox",code:function(event){
                switch (event.type){
                    case "hover":
                        this.setVar("#x",event.x|0);
                        this.setVar("#y",event.y|0);
                        this.setVar("$w",event.w);
                        this.setVar("$h",event.h);
                        this.setVar("#state", "hover");
                    break;
                   case "delete":
                        this.setVar("#x",event.x|0);
                        this.setVar("#y",event.y|0);
                        this.setVar("$w",event.w);
                        this.setVar("$h",event.h);
                        this.setVar("#state", "delete");
                    break;
                    case "select":
                        this.setVar("#x",event.x|0);
                        this.setVar("#y",event.y|0);
                        this.setVar("$w",event.w);
                        this.setVar("$h",event.h);
                        this.setVar("#state", "select");
                    break;
                }
            }
        },
        {
            name:"refreshSelectBox",code:function(event){
                if(event.x){
                    this.setVar("#x",event.x);
                }
                if(event.y){
                    this.setVar("#y",event.y);
                }
            }
        },
        {
            name:"hideSelectBox",code:function(event){
                   this.setVar("#state", "hide");
            }
        }]
}
];