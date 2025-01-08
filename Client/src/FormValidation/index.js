export default function signupValidation(value) {
    let error={};
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    if (value.userName===""){
        error.userName="UserName should not be empty";

    }
    else{
        error.userName="";
    }
    if (value.email===""){
        error.email="Email should not be empty";

    }
    else if(!email_pattern.test(value.email)){
        error.email="Use correct format of email!"

    }
    else{
        error.email="";
    }
    if (value.password===""){
        error.password="Password should not be empty";

    }
    //else if(!pass_pattern.test(value.password)){
    //     error.password="Use correct format of password!"

    // }
    else{
        error.password="";
    }
    if (value.confirmPassword===""){
        error.confirmPassword="confirmPassword should not be empty";

    }
    else if(value.password!=value.confirmPassword){
        error.confirmPassword="Both password should match";

    }
    else{
        error.confirmPassword="";
    }
  return error;
};


export function signinValidation(value) {
    let error={};
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    
    if (value.email===""){
        error.email="Email should not be empty";

    }
    else if(!email_pattern.test(value.email)){
        error.email="Use correct format of email!"

    }
    else{
        error.email="";
    }
    if (value.password===""){
        error.password="Password should not be empty";

    }
    //else if(!pass_pattern.test(value.password)){
    //     error.password="Use correct format of password!"

    // }
    else{
        error.password="";
    }
    if (value.confirmPassword===""){
        error.confirmPassword="confirmPassword should not be empty";

    }
    else if(value.password!=value.confirmPassword){
        error.confirmPassword="Both password should match";

    }
    else{
        error.confirmPassword="";
    }
  return error;
};



export function emailValidation(value) {
    let error={};
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value===""){
        error.email="Email should not be empty";

    }
    else if(!email_pattern.test(value)){
        error.email="Use correct format of email!"

    }
    else{
        error.email="";
    }
    return error;
}
export function codeValidation(value) {
    let error={};
    
    if (value?.code===""){
        error.code="code should not be empty";

    }
    else{
        error.code="";
    }
    return error;
}
export function passwordValidation(value) {
    let error={};
    const pass_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    
    if (value.password===""){
        error.password="Password should not be empty";

    }
    //else if(!pass_pattern.test(value.password)){
    //     error.password="Use correct format of password!"

    // }
    else{
        error.password="";
    }
    if (value.confirmPassword===""){
        error.confirmPassword="confirmPassword should not be empty";

    }
    else if(value.password!=value.confirmPassword){
        error.confirmPassword="Both password should match";

    }
    else{
        error.confirmPassword="";
    }
  return error;
};