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
                    this.engine.getEngineVar("selectedArray").push(this);
                    this.engine.setEngineVar("mouse",event.object);
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
        },
        {
            name:"#loop",code:function(event){
                var selectedArray=this.engine.getEngineVar("selectedArray");
                if( selectedArray && selectedArray.length>0 ){
                    selectedArray.sort(function(a,b){
                        return  b.getVar("#z") - a.getVar("#z");
                    });
                    var that=selectedArray[selectedArray.length-1];
                    var mouse=this.engine.getEngineVar("mouse");
                        if(workspace.currentTool=="move"&&that.getVar("#editor.moving")==false){
                                this.engine.setEngineVar("lastObject", that);
                                workspace.updateProperties();
                                that.setVar("#editor.moving",true);
                                that.setVar("#editor.mx",this.engine.getObject(mouse).getVar("#x")-that.getVar("#x"));
                                that.setVar("#editor.my",this.engine.getObject(mouse).getVar("#y")-that.getVar("#y"));
                                this.engine.execute_event("showSelectBox",{type:"select", x:that.getVar("#x"),y:that.getVar("#y"),w:that.getVar("#boundingBox").w,h:that.getVar("#boundingBox").h,z:that.getVar("#z")-1});
                        }else{
                            that.setVar("#editor.moving",false);
                            this.engine.execute_event("hideSelectBox");
                        }
                        if(workspace.currentTool=="delete"){
                            this.engine.deleteObjectLive(that);
                            workspace.updateObjectList();
                        }
                        if(workspace.currentTool=="select"){
                            this.engine.setEngineVar("lastObject", that);
                            workspace.updateProperties();
                        }

                }
                this.engine.setEngineVar("selectedArray",[]);

            }
        }]
}
];