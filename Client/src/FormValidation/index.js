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
    
    if (value?.email===""){
        error.email="Email should not be empty";

    }
    else if(!email_pattern.test(value?.email)){
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


export function updateProfileInfoValidation(value) {
    let error={};
    
    if (value?.userName===""){
        error.userName="User Name should not be empty";

    }
    else{
        error.userName="";
    }
    if (value?.address===""){
        error.address="Address should not be empty";

    }
    else{
        error.address="";
    }
    if (value?.phone===""){
        error.phone="Phone Number should not be empty";

    }
    else if(value?.phone?.length>10){
        error.phone="Phone Number cannot be more then 10 digits."
    }
    else{
        error.phone="";
    }
    if (value?.gender===""){
        error.gender="You should select the Gender";

    }
    else{
        error.gender="";
    }
    if (value?.DOB===""){
        error.DOB="Select DOB";

    }
    else{
        error.DOB="";
    }
    
    return error;
}

export function changePasswordValidation(value) {
    let error={};
    const pass_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    
    if (value.currentPassword===""){
        error.currentPassword="This field should not be empty";

    }
    else{
        error.currentPassword="";
    }

    if (value.newPassword===""){
        error.newPassword="This field should not be empty";

    }
    //else if(!pass_pattern.test(value.password)){
    //     error.password="Use correct format of password!"

    // }
    else{
        error.newPassword="";
    }
    
    if (value.confirmPassword===""){
        error.confirmPassword="confirmPassword should not be empty";

    }
    else if(value.confirmPassword!=value.newPassword){
        error.confirmPassword="Both password should match";

    }
    else{
        error.confirmPassword="";
    }
  return error;
};

export function becomeTeacherValidation(value) {
    let error={};
    
    if (value?.cv===""){
        error.cv="field should not be empty";

    }
    else{
        error.cv="";
    }
    return error;
}