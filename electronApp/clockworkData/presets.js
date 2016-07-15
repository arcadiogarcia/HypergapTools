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
            this.engine.getAnimationEngine().setSpritesheet(this.spriteholder,this.getVar("spritesheet"));
            this.setVar("moving",false);

        }
    },{
            name:"#collide",code:function(event){
                if(this.engine.getObject(event.object).instanceOf("basicMouse") && event.shape2id==1){
                    if(workspace.currentTool=="move"&&this.getVar("moving")==false){
                        this.setVar("moving",true);
                        this.setVar("mx",this.engine.getObject(event.object).getVar("#x")-this.getVar("#x"));
                        this.setVar("my",this.engine.getObject(event.object).getVar("#y")-this.getVar("#y"));
                        this.engine.execute_event("showSelectBox",{type:"select", x:this.getVar("#x"),y:this.getVar("#y"),w:100,h:100,z:this.getVar("#z")-1});
                    }else{
                        this.setVar("moving",false);
                        this.engine.execute_event("hideSelectBox");
                    }
                }
                if(this.engine.getObject(event.object).instanceOf("basicMouse") && event.shape2id==0){
                    if(this.getVar("moving")==true){
                        this.setVar("#x",this.engine.getObject(event.object).getVar("#x")-this.getVar("mx"));
                        this.setVar("#y",this.engine.getObject(event.object).getVar("#y")-this.getVar("my"));
                        this.engine.execute_event("showSelectBox",{type:"select", x:this.getVar("#x"),y:this.getVar("#y"),w:100,h:100,z:this.getVar("#z")-1});
                    }else{
                        this.engine.execute_event("showSelectBox",{type:"hover", x:this.getVar("#x"),y:this.getVar("#y"),w:100,h:100,z:this.getVar("#z")-1});
                    }
                }
            }
        }],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w":100, "h":100 }
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
            name:"hideSelectBox",code:function(event){
                   this.setVar("#state", "hide");
            }
        }]
}
];