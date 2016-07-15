var vscodeConnection=(function(){

     var pendingRequests=(function(){
         var requestId=0;
         var requests=[];
         return {
             newId:function(cb){
                 var id=requestId++;
                 requests.push({id:id, cb:cb});
                 return id;
             },
             resolve:function(data){
                 var id=data.id;
                 var res=requests.filter(function(x){return x.id==id;});
                 if(res.length==1){
                     requests=requests.filter(function(x){return x.id!=id;});
                     return res[0].cb(data.payload);
                 }else{
                     return;
                 }
             }
         }
     })();

    var socket = io('http://localhost:3000');
    socket.on('reply', function (data) {
        pendingRequests.resolve(data);
    });
    return {
        getScope:function(callback){
            socket.emit('get', { content: 'scope', id: pendingRequests.newId(callback) });          
        },
        getSpritesheets:function(callback){
            socket.emit('get', { content: 'spritesheets', id: pendingRequests.newId(callback) });          
        },
        getLevelFiles:function(callback){
            socket.emit('get', { content: 'levelFiles', id: pendingRequests.newId(callback) });          
        },
        getLevels:function(file,callback){
            socket.emit('get', { content: 'levels', file:file, id: pendingRequests.newId(callback) });          
        },
        getLevelContent:function(file,level,callback){
            socket.emit('get', { content: 'levelContent', file:file,level:level, id: pendingRequests.newId(callback) });          
        },
        getGameConfig:function(callback){
            socket.emit('get', { content: 'gameconfig', id: pendingRequests.newId(callback) });          
        }
    }
})();