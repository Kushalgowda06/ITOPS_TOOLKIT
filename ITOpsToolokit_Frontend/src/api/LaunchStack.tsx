// import LaunchStackClient from "./LaunchStackClient";
import {LaunchStackClient} from '../api/customAxios'

const getLaunchStacks = () => LaunchStackClient.get("/launch_stacks/");

const postLaunchStacks = (requestBody : any ) => LaunchStackClient.post("/launch_stacks/" , requestBody);

const ExportFunction = { 
    getLaunchStacks,
    postLaunchStacks
}

export default ExportFunction
