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

export function courseLandingFormValidation(value) {
    let error={};
    if(value.title===""){
        error.title=`Field Cannot be empty.`
    }
    else{
        error.title=""
    }
    if(value.category===""){
        error.category=`Field Cannot be empty.`
    }
    else{
        error.category=""
    }
    if(value.level===""){
        error.level=`Field Cannot be empty.`
    }
    else{
        error.level=""
    }
    if(value.primaryLanguage===""){
        error.primaryLanguage=`Field Cannot be empty.`
    }
    else{
        error.primaryLanguage=""
    }
    if(value.subtitle===""){
        error.subtitle=`Field Cannot be empty.`
    }
    else{
        error.subtitle=""
    }
    if(value.description===""){
        error.description=`Field Cannot be empty.`
    }
    else{
        error.description=""
    }
    if(value.pricing===""){
        error.pricing=`Field Cannot be empty.`
    }
    else{
        error.pricing=""
    }
    if(value.objectives===""){
        error.objectives=`Field Cannot be empty.`
    }
    else{
        error.objectives=""
    }
    if(value.welcomeMessage===""){
        error.welcomeMessage=`Field Cannot be empty.`
    }
    else{
        error.welcomeMessage=""
    }
    if(value.image===""){
        error.image=`Field Cannot be empty.`
    }
    else{
        error.image=""
    }
    return error;
}
export function courseCurriculumValidation(value) {
    let error={};
    
    if (value?.title===""){
        error.title="field should not be empty";

    }
    else{
        error.title="";
    }
    if (value?.videoUrl===""){
        error.videoUrl="field should not be empty";

    }
    else{
        error.videoUrl="";
    }
    return error;
}

export const updateTeacherValidation=(value)=>{
    let error={};
    if (value?.certificate===""){
        error.certificate="field should not be empty";

    }
    else{
        error.certificate="";
    }
    
    if (value?.avilability===""){
        error.avilability="field should not be empty";

    }
    else{
        error.avilability="";
    }
    if (value?.description===""){
        error.description="field should not be empty";

    }
    else{
        error.description="";
    }
    return error;

}