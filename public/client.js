const socket=io();

//loading all contact
function loadingContact()
{
    fetch('/getcontact').then(response=>response.json()).then(result=>
    {
        if(result.response.length!=0)
        {
            console.log(result);
        }
        else{
            console.log("no any contact present")
        }
    }).catch(err=>{
        console.log(err)
    })
}
//End all loading contact
   var room=prompt("Please enter room id");
//create roomid and send request on the server for the joing 
var room_id;
const user_id="9931206929";
function getRoomId(){
    var data={
        user_id:"8651381177",
        other_id:"8210196406"
    }
    const headers={
        'Content-Type':'application/json'
    }
    fetch('/registerRoom',{method:'post',body:JSON.stringify(data),headers})
    .then(Response=>
        Response.json()
        ).then(result=>{
            //room_id=result.response.room_id
	    if(result.response.length!=0)
		{
		  room_id=result.response[0].room_id

			console.log(room)
                 }
	   else{
	   	room_id=result.response.room_id
		console.log(room_id)
		}
           // console.log(result)

            socket.emit('joinRoom',room)
            socket.emit('liveuser',user_id)
        }).catch(err=>{
            console.log(err)
    })
}
//request transmit for the joing code End

//live user show 
const liveruser=[]
socket.on('liveuser',(data)=>{
    if(liveruser.length==0){
        liveruser.push(data)
        console.log(data)
    }
    else{
        let len=data.length-1;
        liveruser.push(data[len])
        console.log(data[len])
    }
})
//End live user store

//mesage emit on server
$(document).ready(()=>{
    $('#btn').click(()=>{
        var mssg=$('#messageBox').val();
        //console.log(mssg)
        var data={
            isActive0:"0",
            isAcrtive1:"1",
            sender_id:"9199428650",
            senderName:"snandeep",
            msg:mssg,
            room_id:room,
            
        }
	 const headers={
        'Content-Type':'application/json'
        }
      fetch('/storemsg',{method:'post',body:JSON.stringify(data),headers})
      .then(Response=>
        Response.json()
        ).then(result=>{
	if(result.status==="Success"){
	console.log("hii",result)
          socket.emit('message',result.result);
       	}
	else{
	  console.log(result)
           }
       // $('#messageBox').val('')
    }).catch(err=>{
         console.log("somting error",err) 
     })
  })
})
// End transmit message code

//catch message on the server
socket.on('messageSend',(data)=>{
    console.log(data)
})
//end code of cath message
  
    //files send on socket server
   function sendGallery(){
   data1=document.getElementById('gallery').files[0];
   const formData = new FormData();
   formData.append('gallery', data1);
   formData.append('senderName', "shivchand");
    formData.append('sender_id',user_id);
    formData.append('room_id',room_id);
      console.log(data1)
        fetch('/imageupload',{method:'post',body:formData})
        .then(Response=>
            Response.json()
            ).then(result=>{
                if(result.status==='Success'){
		   socket.emit('user gallery',result.result)
                    }
                else{
                    console.log(result)
                }
            }).catch(err=>{
                console.log(err)
            })
   }
//End sending files on socket server
function sendVideo(){
    data1=document.getElementById('gallery').files[0];
    const formData = new FormData();
    formData.append('gallery', data1);
    formData.append('senderName', "shivchand");
     formData.append('sender_id',user_id);
     formData.append('room_id',room_id);
       console.log(data1)
         fetch('/videoupload',{method:'post',body:formData})
         .then(Response=>
             Response.json()
             ).then(result=>{
                 if(result.status==='Success'){
            socket.emit('user video',result.result)
                     }
                 else{
                     console.log(result)
                 }
             }).catch(err=>{
                 console.log(err)
             })
    }
 

 
   //sending document file on socket server
   function sendDocument(){
   data1=document.getElementById('gallery').files[0];
   const formData = new FormData();
   formData.append('document_file', data1);
   formData.append('senderName', "shivchand");
    formData.append('sender_id',user_id);
    formData.append('room_id',room_id);
      console.log(data1)
        fetch('/documentfileupload',{method:'post',body:formData})
        .then(Response=>
            Response.json()
            ).then(result=>{
                if(result.status==='Success'){
                      socket.emit('user document',result);
                    }
                else{
                    console.log(result)
                }
            }).catch(err=>{
                console.log(err)
            })
   }
  //End sending document on socket server

  //send audio on socket server
   function sendAudio(){
   data1=document.getElementById('gallery').files[0];
   const formData = new FormData();
   formData.append('audio', data1);
   formData.append('senderName', "shivchand");
    formData.append('sender_id',user_id);
    formData.append('room_id',room_id);
      console.log(data1)
        fetch('/audiofileupload',{method:'post',body:formData})
        .then(Response=>
            Response.json()
            ).then(result=>{
                if(result.status==='Success'){
                      socket.emit('user audio',result);
                    }
                else{
                    console.log(result)
                }
            }).catch(err=>{
                console.log(err)
            })
   }
  //End sending audio on socket server

  //send camera  images and video
   function sendCamera(){
   data1=document.getElementById('gallery').files[0];
   const formData = new FormData();
   formData.append('camera_img', data1);
   formData.append('senderName', "shivchand");
    formData.append('sender_id',user_id);
    formData.append('room_id',room_id);
      console.log(data1)
        fetch('/cameraimagesupload',{method:'post',body:formData})
        .then(Response=>
            Response.json()
            ).then(result=>{
                if(result.status==='Success'){
                      socket.emit('user camera',result);
                    }
                else{
                    console.log(result)
                }
            }).catch(err=>{
                console.log(err)
            })
       }



  //catch files
  socket.on('user gallery',(data)=>{
      console.log(data)
      socket.emit(data)
    //document.getElementById("insertimg").src=data
  })
 
  //end catch gallery
  socket.on('user video',(data)=>{
    console.log(data)
    socket.emit(data)
  //document.getElementById("insertimg").src=data
})
  //catch document files
  socket.on("user document",(data)=>{
   console.log(data);
   socket.emit(data)
  })
  //end catch document files
  
  // catch audio files
  socket.on("user audio",(data)=>{
  console.log(data) 
  socket.emit(data) 
 })
  //end audio files catching
  
  //catch cameras files
  socket.on("user camera",(data)=>{
   console.log(data);
   socket.emit(data)
   })
//leve user
socket.on('leve',(data)=>{
    console.log(data)
    socket.emit(data)
})
//end user leve 

