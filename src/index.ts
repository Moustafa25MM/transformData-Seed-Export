import { transformData } from "./helpers/transformData";
import { connectToMongoDB } from "./mongooseConnection";

connectToMongoDB().then(async ()=>{
    await transformData();
})