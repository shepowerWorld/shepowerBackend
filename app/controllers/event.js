const eventSchema=require('../models/event')
const leaderUsermaster=require('../models/registrationleader')
// const moment = require('moment');
const moment = require('moment-timezone');



// exports.createEvent = async (req, res) => {
//   try {
//     const { user_id, eventname, eventdescription, eventlocation, eventtime, eventlink } = req.body;
//     const eventImages = req.files;
//     if (!user_id) {
//       return res.status(400).json({ Status: false, message: 'user_id is required' });
//     } else {
//       const leaderCheck = await leaderUsermaster.findOne({ _id: user_id });
//       if (leaderCheck) {
//         const eventTime = new Date(eventtime);
//           const eventEndTime = new Date(eventTime);
//           eventEndTime.setHours(eventEndTime.getHours() + 1);
//         const eventPromises = eventImages.map(async (eventImage) => {
//           const data = new eventSchema({
//             user_id:user_id,
//             eventname: eventname,
//             eventdescription: eventdescription,
//             eventlocation: eventlocation,
//             eventimage: eventImage.filename,
//             eventtime: eventtime,
//             eventlink: eventlink,
//             eventendtime:eventEndTime
//           });
//           return data.save();
//         });

//         const responses = await Promise.all(eventPromises);

//         return res.status(200).json({ Status: true, message: 'Events created Successfully', responses });
//       } else {
//         return res.status(400).json({ Status: false, message: 'Only leader can create events' });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: 'Some error occurred', error });
//   }
// };


// exports.createEvent = async (req, res) => {
//   try {
//     const { user_id, eventname, eventdescription, eventlocation, eventtime, eventlink } = req.body;
//     const eventImages = req.files;

//         if (!user_id) {
//       return res.status(400).json({ Status: false, message: 'user_id is required' });
//     } else {
//       const leaderCheck = await leaderUsermaster.findOne({ _id: user_id });
//       if (leaderCheck) {
//         const eventTime = new Date(eventtime);
//         const eventEndTime = new Date(eventTime);
//         eventEndTime.setHours(eventEndTime.getHours() + 1);
        
//         const data = new eventSchema({
//           user_id: user_id,
//           eventname: eventname,
//           eventdescription: eventdescription,
//           eventlocation: eventlocation,
//           eventimage: eventImages[0].filename, // Assuming you are uploading only one image
//           eventtime: eventtime,
//           eventlink: eventlink,
//           eventendtime: eventEndTime
//         });

//         const savedEvent = await data.save();

//         // Schedule a deletion task after 1 hour of the event end time
//         const deletionTime = new Date(eventEndTime);
//         deletionTime.setHours(deletionTime.getHours() + 1);
//         setTimeout(async () => {
//           await eventSchema.findByIdAndDelete(savedEvent._id);
//           console.log('Event deleted successfully after end time.');
//         }, deletionTime - new Date());
        
//         return res.status(200).json({ Status: true, message: 'Event created Successfully', response: savedEvent });
//       } else {
//         return res.status(400).json({ Status: false, message: 'Only leaders can create events' });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: 'Some error occurred', error });
//   }
// };



// exports.getLiveEvents = async (req, res) => {
//   try {
//     const now = new Date();
    
//     // Calculate the timestamp 1 hour ago
//     const oneHourAgo = new Date(now);
//     oneHourAgo.setHours(now.getHours() - 1);

//     const response = await eventSchema.find({
//       eventtime: { $gte: oneHourAgo, $lte: now }, // Retrieve events where eventendtime is within the last hour
//     });

//     if (response && response.length > 0) {
//       return res.send({ status: true, message: "Get Data Successfully", response });
//     } else {
//       return res.status(401).send({ status: false, message: "No data available" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   } 
// };

exports.getLiveEvents = async (req, res) => {
  try {
    const now = new Date();
    
    // Calculate the timestamp 1 hour ago
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);
    console.log("oneHourAgo",oneHourAgo)
    const response1 = await eventSchema.find({
      eventtime: { $gte: oneHourAgo, $lte: now }, // Retrieve events where eventendtime is within the last hour
    });

    if (response1 && response1.length > 0) {
      const response = response1.map(event => {
        const eventTimeInUTC = moment(event.eventtime).tz('Asia/Kolkata');
        const eventEndingTimeInUTC = moment(event.eventendtime).tz('Asia/Kolkata');
        const modifiedTime = eventTimeInUTC.clone().add(330, 'minutes'); // Add 330 minutes (5 hours and 30 minutes)
        const modifiedEndTime = modifiedTime.clone().add(60, 'minutes'); 
        event.eventtime = modifiedTime.format('YYYY-MM-DD HH:mm:ss');
        event.eventendtime= modifiedEndTime.format('YYYY-MM-DD HH:mm:ss');
        return event;
      });

      return res.send({ status: true, message: "Get Data Successfully", response });
    } else {
      return res.status(401).send({ status: false, message: "No data available" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Something went wrong" });
  } 
};



// exports.upcomingEvent = async (req, res) => {
//   try {
//     const now = new Date();
//     const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // One hour from now
//     const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // Two days from now

//     const response = await eventSchema.find({
//       eventtime: { $gte: oneHourFromNow, $lt: twoDaysFromNow },
//     });

//     if (response && response.length > 0) {
//       return res.send({ status: true, message: "Get Data Successfully", response });
//     } else {
//       return res.status(401).send({ status: false, message: "No data available" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   }
// };

// exports.upcomingEvent = async (req, res) => {
//   try {
//     const now = new Date();
//     const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // One hour from now
//     const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // Two days from now

//     const events = await eventSchema.find({
//       eventtime: { $gte: oneHourFromNow, $lt: twoDaysFromNow },
//     });

//     const response = events.map(event => {
//       const eventTimeInUTC = moment(event.eventtime).tz('Asia/Kolkata');
//       const eventEndingTimeInUTC = moment(event.eventendtime).tz('Asia/Kolkata');
//       const modifiedTime = eventTimeInUTC.clone().add(330, 'minutes'); // Add 330 minutes (5 hours and 30 minutes)
//       const modifiedEndTime = modifiedTime.clone().add(60, 'minutes'); 
//       event.eventtime = modifiedTime.format('YYYY-MM-DD HH:mm:ss');
//       event.eventendtime= modifiedEndTime.format('YYYY-MM-DD HH:mm:ss');
//       return event;
//     });

//     const inputDate = new Date('2023-03-11'); // Assuming the format is YYYY-MM-DD
// const utcDate = new Date(
//   Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate())
// );

// console.log(utcDate.toISOString()); // UTC time in ISO 8601 format


//     if (events && events.length > 0) {
//       return res.send({ status: true, message: "Get Data Successfully", response: response });
//     } else {
//       return res.status(401).send({ status: false, message: "No data available" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   }
// };

// exports.myEvents=async(req,res)=>{
//   try {
//     const{user_id}=req.body
//     if (!user_id) {
//       return res.status(400).json({ Status: false, message: 'user_id is required' });
//     } else {
//     const response = await eventSchema.find({
// user_id:user_id
//     });

//     if (response) {
//       return res.send({ status: true, message: "Get Data Successfully", response });
//     } else {
//       return res.status(401).send({ status: false, message: "No data available" });
//     }
//   }
//  } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   }
// }

exports.upcomingEvent = async (req, res) => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // One hour from now
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // Two days from now

    const events = await eventSchema.find({
      eventtime: { $gte: oneHourFromNow, $lt: twoDaysFromNow },
    });

    for (const event of events) {
      // Calculate one hour after the event creation time
      const oneHourAfterCreation = new Date(event.createdAt.getTime() + (60 * 60 * 1000)); 

      // Check if current time is greater than one hour after creation
      if (now > oneHourAfterCreation) {
        // Delete the event
        await eventSchema.deleteOne({ _id: event._id });
        console.log(`Event with ID ${event._id} deleted successfully after one hour`);
      }
    }

    const response = events.map(event => {
      const eventTimeInUTC = moment(event.eventtime).tz('Asia/Kolkata');
      const eventEndingTimeInUTC = moment(event.eventendtime).tz('Asia/Kolkata');
      const modifiedTime = eventTimeInUTC.clone().add(330, 'minutes'); // Add 330 minutes (5 hours and 30 minutes)
      const modifiedEndTime = modifiedTime.clone().add(60, 'minutes'); 
      event.eventtime = modifiedTime.format('YYYY-MM-DD HH:mm:ss');
      event.eventendtime= modifiedEndTime.format('YYYY-MM-DD HH:mm:ss');
      return event;
    });

    if (events && events.length > 0) {
      return res.send({ status: true, message: "Get Data Successfully", response: response });
    } else {
      return res.status(401).send({ status: false, message: "No data available" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

exports.myEvents=async(req,res)=>{
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ Status: false, message: 'user_id is required' });
    } else {
      const response = await eventSchema.find({
        user_id: user_id
      });

      for (const event of response) {
        // Calculate one hour after the event creation time
        const oneHourAfterCreation = new Date(event.createdAt.getTime() + (60 * 60 * 1000)); 

        // Check if current time is greater than one hour after creation
        if (now > oneHourAfterCreation) {
          // Delete the event
          await eventSchema.deleteOne({ _id: event._id });
          console.log(`Event with ID ${event._id} deleted successfully after one hour`);
        }
      }

      if (response) {
        return res.send({ status: true, message: "Get Data Successfully", response });
      } else {
        return res.status(401).send({ status: false, message: "No data available" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

// exports.getAllEvents=async(req,res)=>{
//   try {
//     const{user_id}=req.body

//     const response = await eventSchema.find({});

//     if (response) {
//       return res.send({ status: true, message: "Get Data Successfully", response });
//     } else {
//       return res.status(401).send({ status: false, message: "No data available" });
//   }
//  } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   }
// }


exports.updateEvent = async (req, res) => {
  try {
    const event_id=req.body._id
    const eventName = req.body.eventname;
    const eventDescription = req.body.eventdescription;
    const eventLocation = req.body.eventlocation;
    const eventImage = req.file ? req.file.filename : undefined;
    const eventTime = req.body.eventtime;
    const eventLink = req.body.eventlink;

    if (!event_id) {
      return res.status(400).send({ status: 'false', message: 'Please provide event_id' });
    }

    const updateFields = {};

    if (eventName) {
      updateFields.eventname = eventName;
    }

    if (eventDescription) {
      updateFields.eventdescription = eventDescription;
    }

    if (eventLocation) {
      updateFields.eventlocation = eventLocation;
    }

    if (eventImage) {
      updateFields.eventimage = eventImage;
    }

    if (eventTime) {
      updateFields.eventtime = eventTime;
    }

    if (eventLink) {
      updateFields.eventlink = eventLink;
    }


    const updatedEvents = await eventSchema.findOneAndUpdate({ _id: event_id }, { $set: updateFields });

    if (!updatedEvents) {
      
      return res.status(404).json({ status: false, message: 'No events found for the user_id' });
    }
    const response=await eventSchema.findOne({_id:event_id})
    return res.status(200).json({ status: true, message: 'Events updated successfully', response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Some error occurred', error });
  }
};                                                                   
exports.acceptUser = async (req , res)=>{

try{

const {eventId, userId} = req.body;


let event = await Event.findById(eventId);

if(!event){
return res.status(404).json ({status : false, message : 'Event Not Found'});

}

if(event.participants.includes (userId)){

  return res.status (400).json ({staus:false , message:'User is Already A Participant'});
}else{

 event = event.participants.push(userId);
  
  const response = await event.save();
  
  return res.status(200).json({ message: 'User has accepted to join the event' , response});
}

}catch(error){
  console.log(error);
  return res.status(500).json({status:false , message:'some error occured' ,  error})
}
}
exports.userJoined = async (req , res)=>{
try {

  const eventId = req.params.eventId ;
  const {eventLink} = req.body;

const event = await Event.findById(eventId)

if (!event){

  return res.status(404).json ({message :'Event Not Found'});
}
event.Link = eventLink ; 

const response = await Event.save();

return res.status(200).json({ message: 'User joined the event virtually' , response});

}catch(error){
  console.log(error);
  return res.status(500).json ({status:false , message:'some error occured', error })
}
}
exports.deleteEvent=async(req,res)=>{
  try{
const {user_id,event_id}=req.body
const data=await eventSchema.findOne({user_id:user_id})
if(data){
const result=await eventSchema.findOneAndDelete({_id:event_id})
if(result){
  return res.send({ status: true, message: "Events deleted Successfully", result });
    } else {
      return res.status(401).send({ status: false, message: "No data available" });
    }
}else{
  return res.status(401).send({ status: false, message: "only event creater can delete this" });
}
  }catch(error){
  console.log(error);
  return res.status(500).json ({status:false , message:'some error occured', error })
}
}
  
  

exports.getEvents = async (req,res)=>{
  try{
      const user = await
      eventSchema.findById(req.params.id);
      return res.status(200).send({ status: true, message: "GetEvent Successfully",user });
  }catch(error){
  return res.status(500).json ({status:false , message:'some error occured', error })
    
  }
   };

  //  exports.getAllEvents=async(req,res)=>{
  //   try {
  //     const{user_id}=req.body
  
  //     const events = await eventSchema.find({});
  
  //    const response =events
  //     //= events.map(event => {
  //     //   const eventTimeInUTC = moment(event.eventtime).tz('Asia/Kolkata');
  //     //   const eventEndingTimeInUTC = moment(event.eventendtime).tz('Asia/Kolkata');
  //     //   const modifiedTime = eventTimeInUTC.clone().add(330, 'minutes'); // Add 330 minutes (5 hours and 30 minutes)
  //     //   const modifiedEndTime = modifiedTime.clone().add(60, 'minutes'); 
  //     //   event.eventtime = modifiedTime.format('YYYY-MM-DD HH:mm:ss');
  //     //   event.eventendtime= modifiedEndTime.format('YYYY-MM-DD HH:mm:ss');
  //     //   return event;
  //     // });
      
  
  //     // const currentUTCTime = new Date();
  
  //     // console.log('Current IST Time:', currentUTCTime);
    
  
  //     if (response) {
  //       return res.send({ status: true, message: "Get Data Successfully", response });
  //     } else {
  //       return res.status(401).send({ status: false, message: "No data available" });
  //   }
  //  } catch (err) {
  //     console.error(err);
  //     return res.status(500).send({ status: false, message: "Something went wrong" });
  //   }
  // }



  // createEvent API
// createEvent API
exports.createEvent = async (req, res) => {
  try {
    const { user_id, eventname, eventdescription, eventlocation, eventtime, eventlink } = req.body;
    const eventImages = req.files;

    if (!user_id) {
      return res.status(400).json({ status: false, message: 'user_id is required' });
    } else {
      const leaderCheck = await leaderUsermaster.findOne({ _id: user_id });
      if (leaderCheck) {
        const eventTime = new Date(eventtime);
        const eventEndTime = new Date(eventTime);
        eventEndTime.setHours(eventEndTime.getHours() + 1);
        
        const data = new eventSchema({
          user_id: user_id,
          eventname: eventname,
          eventdescription: eventdescription,
          eventlocation: eventlocation,
          eventimage: eventImages[0].filename, // Assuming you are uploading only one image
          eventtime: eventtime,
          eventlink: eventlink,
          eventendtime: eventEndTime
        });

        const savedEvent = await data.save();
        // const responses = await Promise.all(eventPromises);
        
        return res.status(200).json({ status: true, message: 'Event created Successfully', response: savedEvent });
      } else {
        return res.status(400).json({ status: false, message: 'Only leaders can create events' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Some error occurred', error });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    // Fetch all events without any filters
    const events = await eventSchema.find({});
    
    // Current time
    const now = new Date();

    // Iterate through each event
    for (const event of events) {
      // Calculate one hour after the event creation time
      const oneHourAfterCreation = new Date(event.createdAt.getTime() + (60 * 60 * 1000)); 

      // Check if current time is greater than one hour after creation
      if (now > oneHourAfterCreation) {
        // Delete the event
        await eventSchema.deleteOne({ _id: event._id });
        console.log(`Event with ID ${event._id} deleted successfully after one hour`);
      }
    }

    if (events.length > 0) {
      return res.status(200).json({ status: true, message: "Data retrieved successfully", response: events });
    } else {
      return res.status(404).json({ status: false, message: "No events available" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

  
  

// exports.getAllEvents = async (req, res) => {
//   try {
//     // Find all events
//     const events = await eventSchema.find({});

//     // Schedule deletion for events older than one hour
//     events.forEach(event => {
//       const eventEndTime = new Date(event.eventendtime);
//       const currentTime = new Date();
//       // Check if event has ended more than an hour ago
//       if (eventEndTime <= currentTime) {
//         const deletionTime = new Date(eventEndTime);
//         deletionTime.setHours(deletionTime.getHours() + 1);
//         setTimeout(async () => {
//           await eventSchema.findByIdAndDelete(event._id);
//           console.log('Event deleted successfully after end time.');
//         }, deletionTime - currentTime);
//       } else {
//         // Event is still active, schedule deletion after one hour from its end time
//         const deletionTime = new Date(eventEndTime);
//         deletionTime.setHours(deletionTime.getHours() + 1);
//         setTimeout(async () => {
//           await eventSchema.findByIdAndDelete(event._id);
//           console.log('Event deleted successfully after one hour from end time.');
//         }, deletionTime - currentTime);
//       }
//     });

//     return res.send({ status: true, message: "Get Data Successfully", response: events });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Something went wrong" });
//   }
// }

  //  exports.getAllEvents=async(req,res)=>{
  //   try {
  //     const{user_id}=req.body
  
  //     const events = await eventSchema.find({});
  
  //    const response =events
  //    const eventCreate = await eventSchema.findOne({ user_id }).sort({ createdAt: -1 });
  //    if (eventCreate && eventCreate.createdAt) {
  //     const now = new Date();
  //     const oneHourAfterCreation = new Date(eventCreate.createdAt.getTime() + (1 * 60 * 60 * 1000)); // Adding one hour to the event's creation time
      
  //     if (now > oneHourAfterCreation) {
  //       // Delete the event
  //       await eventSchema.deleteOne({ _id: eventCreate._id });
        
  //       return res.status(200).json({ status: true, message: 'Event deleted successfully after one hour' });
  //     }
  //   }
    
  //     if (response) {
  //       return res.send({ status: true, message: "Get Data Successfully", response });
  //     } else {
  //       return res.status(401).send({ status: false, message: "No data available" });
  //   }
  //  } catch (err) {
  //     console.error(err);
  //     return res.status(500).send({ status: false, message: "Something went wrong" });
  //   }
  // }
