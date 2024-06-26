import express from "express";
import {fetchAgents} from '../utils/scripts.js'


const router = express.Router();

router.put('/', async (req,res) => {
    const {email} = req.body;
    console.log(email);
    const agents = await fetchAgents();
    const agent = agents.find(agent => agent.email === email);
    if (agent){
        agent.confirmedMailing = false;
        await agent.save()
        res.status(200).send('Successfully saved agent details')
    }else{
        res.status(404);
        throw new Error("Agent not found");
    }
})

export default router;
