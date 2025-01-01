import mongoose from 'mongoose';

const connect=async (URL)=>{
try{
await mongoose.connect(URL);
console.log("Connected to DB Successfully")
}
catch(error){
console.log(`Some error arises: ${error?.message}`);

}
}
export default connect;