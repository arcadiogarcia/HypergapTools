exports.files = [
    {
        name: "manifest.json", content: `{
    "name": "#projectName#",
    "scope": "gameFiles",
    "presets": [
        "presets.js"
    ],
    "levels": [
        "levels.xml"
    ],
    "spritesheets":[
        "spritesheets.xml"
    ],
    "screenResolution": {
        "w": 800,
        "h": 400
    },
    "externalCode":[],
    "dependencies": {
        "presets":["mouse","storage","notificationManager","keyboard"],
        "collisions":["pointsAndBoxes"]
    },
    "themeColor":"#4B5",
    "backgroundColor":"#333",
    "tileIcon":"tileIcon.png",
    "enginefps": 60,
    "animationfps": 60
}`
    },
    {
        name: "gameFiles/presets.js", content: `HYPERGAP.presets.push([
    {
        name: "talkingDog",
        sprite: "dog",
        events: [
            {
                name: "#setup", code: function (event) {
                    console.log("Preset loaded");
                    this.setVar("$text", "");
                    this.setVar("timer", 0);
                }
            },
            {
                name: "#loop", code: function (event) {
                    console.log("Preset loaded");
                    var t=this.getVar("timer");
                    this.setVar("timer", t+1);
                    if(t==100){
                        this.setVar("$text", "Hello World");
                        this.setVar("#state","BarkL");
                    }
                    if(t==150){
                        this.setVar("$text", "");
                        this.setVar("#state","RunR");
                    }
                    if(t>150){
                        this.setVar("#x",this.getVar("#x")+5);
                    }
                }
            }]
    }]);`
    },
    {
        name: "gameFiles/levels.xml", content: `<?xml version="1.0" encoding="utf-8"?>
<levels>
  <level id="mainLevel">
    <object name="JakeTheDog" type="talkingDog" x="200" y="200" ></object>
  </level>
</levels>`
    },
    {
        name: "gameFiles/spritesheets.xml", content: `<?xml version="1.0" encoding="utf-8"?>
        <spritesheets>
  <spritesheet name="dog" src="images/dog.png">

    <states>
      <state name="IdleL">
        <layer name="Idle1"></layer>
          <layer name="text"></layer>
      </state>
      <state name="IdleR" flip="h">
        <layer name="Idle1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="RunL">
        <layer name="Run1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="RunR" flip="h">
        <layer name="Run1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="SeeUL">
        <layer name="SeeU1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="SeeUR" flip="h">
        <layer name="SeeU1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="BarkL">
        <layer name="Bark1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="BarkR" flip="h">
        <layer name="Bark1"></layer>
         <layer name="text"></layer>
      </state>
      <state name="Scare">
        <layer name="Scare1"></layer>
         <layer name="text"></layer>
      </state>
    </states>

    <layers>
      <layer name="Idle1" x="0" y="0">
        <frame name="I1"></frame>
        <frame name="I2"></frame>
        <frame name="I3"></frame>
        <frame name="I4"></frame>
        <frame name="I5"></frame>
        <frame name="I6"></frame>
      </layer>
      <layer name="Run1" x="0" y="0">
        <frame name="R1"></frame>
        <frame name="R2"></frame>
        <frame name="R3"></frame>
        <frame name="R4"></frame>
        <frame name="R5"></frame>
        <frame name="R6"></frame>
      </layer>
      <layer name="SeeU1" x="0" y="0">
        <frame name="S1"></frame>
        <frame name="S2"></frame>
        <frame name="S3"></frame>
      </layer>
      <layer name="Bark1" x="0" y="0">
        <frame name="B1"></frame>
        <frame name="B2"></frame>
        <frame name="B3"></frame>
        <frame name="B4"></frame>
      </layer>
      <layer name="Scare1" x="0" y="0">
        <frame name="O1"></frame>
        <frame name="O2"></frame>
        <frame name="O3"></frame>
        <frame name="O4"></frame>
        <frame name="O5"></frame>
      </layer>
      <layer name="text" x="55" y="110">
        <frame name="text"></frame>
      </layer>
    </layers>

    <frames>
      <frame name="I1" x="0" y="0" w="117" h="118" t="100"></frame>
      <frame name="I2" x="117" y="0" w="117" h="118" t="100"></frame>
      <frame name="I3" x="234" y="0" w="117" h="118" t="100"></frame>
      <frame name="I4" x="351" y="0" w="117" h="118" t="100"></frame>
      <frame name="I5" x="468" y="0" w="117" h="118" t="100"></frame>
      <frame name="I6" x="585" y="0" w="117" h="118" t="100"></frame>

      <frame name="R1" x="0" y="354" w="117" h="118" t="100"></frame>
      <frame name="R2" x="117" y="354" w="117" h="118" t="100"></frame>
      <frame name="R3" x="234" y="354" w="117" h="118" t="100"></frame>
      <frame name="R4" x="351" y="354" w="117" h="118" t="100"></frame>
      <frame name="R5" x="468" y="354" w="117" h="118" t="100"></frame>
      <frame name="R6" x="585" y="354" w="117" h="118" t="100"></frame>

      <frame name="S1" x="0" y="118" w="117" h="118" t="100"></frame>
      <frame name="S2" x="117" y="118" w="117" h="118" t="500"></frame>
      <frame name="S3" x="234" y="118" w="117" h="118" t="100"></frame>

      <frame name="B1" x="0" y="472" w="117" h="118" t="100"></frame>
      <frame name="B2" x="117" y="472" w="117" h="118" t="100"></frame>
      <frame name="B3" x="234" y="472" w="117" h="118" t="100"></frame>
      <frame name="B4" x="351" y="472" w="117" h="118" t="100"></frame>

      <frame name="O1" x="0" y="236" w="117" h="118" t="100"></frame>
      <frame name="O2" x="117" y="236" w="117" h="118" t="100"></frame>
      <frame name="O3" x="234" y="236" w="117" h="118" t="100"></frame>
      <frame name="O4" x="351" y="236" w="117" h="118" t="100"></frame>
      <frame name="O5" x="468" y="236" w="117" h="118" t="100"></frame>

      <frame name="text" code="context.textBaseline ='top';context.textAlign='center';context.font='20pt Verdana';context.fillStyle = '#FFF';context.fillText(vars['$text'],x,y);" t="0"></frame>
  
    </frames>

  </spritesheet>
  </spritesheets>`
    },
    {
        name: "gameFiles/images/dog.png", file: "files/dog.png"
    },
    {
        name: "gameFiles/tileIcon.png", file: "files/tileIcon.png"
    },
];

exports.folders = [
    {
        name: "gameFiles", folders: [
            { name: "images" }
        ]
    }
]