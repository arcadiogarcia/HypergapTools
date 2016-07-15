// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var basicClickPreset = [
{
    name: "basicMouse",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("listener_click", this.engine.getEngineVar("#DOM").addEventListener("click", (function (that) { return that.execute_event.curryThis(that, "onclick") })(this), false));
                this.setVar("listener_move", this.engine.getEngineVar("#DOM").addEventListener("mousemove", (function (that) { return that.execute_event.curryThis(that, "onmove") })(this), false));
                this.setVar("listener_up", this.engine.getEngineVar("#DOM").addEventListener("mouseup", (function (that) { 
                    return function(){that.engine.execute_event("mouseup")}
                 })(this), false));
            }
        },
        {
            name: "#exit", code: function (event) {
                this.engine.getEngineVar("#DOM").removeEventListener("click", this.getVar("listener_click"));
                this.engine.getEngineVar("#DOM").removeEventListener("mousemove", this.getVar("listener_move"));
                this.engine.getEngineVar("#DOM").removeEventListener("mouseup", this.getVar("listener_up"));
            }
        },
        {
            name: "onclick", code: function (e) {
                this.setVar("timer", -1);
                //Warning: This will only work if there is no scaling between the game coordinates and the canvas!
                //If you are using a custom Spritesheet.js renderMode, you will need to do something like this:
                //
                //cx=  e.clientX / window.innerWidth * 1366;
                //cy = (e.clientY - (window.innerHeight - 768 * window.innerWidth / 1366) / 2) * 1366 / window.innerWidth
                //
                // Where 1366x768 is the size of the buffer and the virtual game screens
            }
        },
         {
             name: "onmove", code: function (e) {
                 var tx = e.offsetX == undefined ? e.layerX : e.offsetX;
                 var ty = e.offsetY == undefined ? e.layerY : e.offsetY;

                 if (window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width < window.innerHeight / CLOCKWORKCONFIG.screenbuffer_width) {
                     tx = CLOCKWORKCONFIG.screenbuffer_width * tx / window.innerWidth;
                     var ypos = (window.innerHeight - CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width) / 2;
                     var height = (CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width);
                     ty = CLOCKWORKCONFIG.screenbuffer_height * (ty - ypos) / height;
                 } else {
                     ty = CLOCKWORKCONFIG.screenbuffer_height * ty / window.innerHeight;
                     var xpos = (window.innerWidth - CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height) / 2;
                     var width = (CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height);
                     tx = CLOCKWORKCONFIG.screenbuffer_width * (tx - xpos) / width;
                 }
                 this.setVar("#x",tx);
                 this.setVar("#y",ty);
                 //Warning: Read the previous warning
             }
         },
         {
             name: "#loop", code: function (event) {
                 //We wait one iteration before deleting the click coordinates
                 if (this.getVar("timer") == 1) {
                     this.collision["point"][1].x = NaN;
                     this.collision["point"][1].y = NaN;
                     this.collisionChanged();
                     this.setVar("timer", 0);
                 }
                 if (this.getVar("timer") ==-1) {
                     this.collision["point"][1].x=this.getVar("#x");
                     this.collision["point"][1].y = this.getVar("#y");
                     this.collisionChanged();
                     this.setVar("timer", 1);
                 }
             }
         }
    ],
    collision: {
        "point": [
            //Coordinates of the pointer
            { "x": 0, "y": 0 },
            //Coordinates of the click
            { "x": NaN, "y": NaN }
        ]
    }
}
];
