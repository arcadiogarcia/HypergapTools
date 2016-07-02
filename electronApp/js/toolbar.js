var Toolbar=(function (toolbars){
            var windows=[];
            toolbars.forEach(function(t,i){
                windows.push({window:"toolbar"+i, handle:"handle"+i,minimize:"minimize"+i})
                var toolbar = document.createElement('div');
                toolbar.id = 'toolbar'+i;
                toolbar.className = 'menu';
                toolbar.style.left=50+150*i;
                toolbar.style.top=50;
                document.body.appendChild(toolbar);

                var handle = document.createElement('div');
                handle.id = 'handle'+i;
                handle.className = 'handle';
                toolbar.appendChild(handle);

                var minimize= document.createElement('div');
                minimize.id = 'minimize'+i;
                minimize.className = 'minimize';
                toolbar.appendChild(minimize);

                t.children.forEach(function(c,j){
                    var children= document.createElement('div');
                    children.id = 'children'+i+"_"+j;
                    switch(c.type){
                        case "button":
                            children.className = 'button';
                            children.innerHTML=c.text;
                            if(c.enabled==false){
                                children.className+=" disabled";
                            }
                        break;
                    }
                    toolbar.appendChild(children);
                })
            });
			var selectedWindow;
				function startDrag(e) {
					// determine event object
					if (!e) {
						var e = window.event;
					}

					// IE uses srcElement, others use target
					var targ = e.target ? e.target : e.srcElement;

					windows.forEach(function(w){
						if(targ.id==w.handle){
							selectedWindow=w.window;
							offsetX = e.clientX;
							offsetY = e.clientY;					
							targ=document.getElementById(w.window);
							// calculate integer values for top and left 
							// properties
							coordX = parseInt(targ.style.left);
							coordY = parseInt(targ.style.top);
							drag = true;
							// move div element
							document.onmousemove=dragDiv;
						 }
					});
					
				}
				function dragDiv(e) {
					if (!drag) {return};
					if (!e) { var e= window.event};
					var targ=document.getElementById(selectedWindow);
					// move div element
					targ.style.left=coordX+e.clientX-offsetX+'px';
					targ.style.top=coordY+e.clientY-offsetY+'px';
					return false;
				}
				function stopDrag() {
					drag=false;
				}

				
					document.onmousedown = startDrag;
					document.onmouseup = stopDrag;

					windows.forEach(function(w) {
						var minimized=false;
						document.getElementById(w.minimize).addEventListener("click", function(x){
							if(minimized){
								document.getElementById(w.window).style.height="auto";
								minimized=false;
							}else{
								document.getElementById(w.window).style.height="20px";
								minimized=true;
							}
						});
					});

                    return {};
                });