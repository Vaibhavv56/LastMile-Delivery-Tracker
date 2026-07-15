import {

createAgentService,

getAllAgentsService,

getAgentByIdService,

updateAgentService,

deleteAgentService,

updateAvailabilityService

} from "../services/agent.service.js";

export const createAgent = async (req,res)=>{

try{

const agent = await createAgentService(req.body);

res.status(201).json({

success:true,

message:"Agent created successfully.",

data:agent

});

}catch(err){

res.status(400).json({

success:false,

message:err.message

});

}

};

export const getAllAgents = async(req,res)=>{

const agents = await getAllAgentsService();

res.json({

success:true,

data:agents

});

};

export const getAgentById = async(req,res)=>{

const agent = await getAgentByIdService(Number(req.params.id));

if(!agent){

return res.status(404).json({

success:false,

message:"Agent not found."

});

}

res.json({

success:true,

data:agent

});

};

export const updateAgent = async(req,res)=>{

try{

const agent = await updateAgentService(Number(req.params.id),req.body);

res.json({

success:true,

message:"Agent updated successfully.",

data:agent

});

}catch(err){

res.status(400).json({

success:false,

message:err.message

});

}

};

export const deleteAgent = async(req,res)=>{

await deleteAgentService(Number(req.params.id));

res.json({

success:true,

message:"Agent deactivated successfully."

});

};

export const updateAvailability = async(req,res)=>{

const agent = await updateAvailabilityService(

Number(req.params.id),

req.body.availability

);

res.json({

success:true,

message:"Availability updated.",

data:agent

});

};