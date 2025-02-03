
export const initialLogData={
    email:"",
    password:"",
    confirmPassword:""
}
export const initialSignData={
    email:"",
    userName:"",
    password:"",
    confirmPassword:""
}
export const registerForm=[
    {
    Label:'Email',
    name:"email",
    componentType:"input",
    placeholder:'Enter your email'

},
{
    Label:'User Name',
    name:"userName",
    componentType:"input",
    placeholder:'Enter your User Name'

},
{
    Label:'Password',
    name:"password",
    componentType:"input",
    placeholder:'Create Password'

},
{
    Label:'Confirm Password',
    name:"confirmPassword",
    componentType:"input",
    placeholder:'Password Confirmation'

},
]

export const loginForm=[
    {
    Label:'Email',
    name:"email",
    componentType:"input",
    placeholder:'Enter your email'

},
{
    Label:'Password',
    name:"password",
    componentType:"input",
    placeholder:'Enter Password'

},
{
    Label:'Confirm Password',
    name:"confirmPassword",
    componentType:"input",
    placeholder:'Password Confirmation'

},
]
export const emailDialogInitialState={email:""}

export const emailInputs=[
    {
        label:"Email",
        name:"email",
        placeholder:"Enter User Email.",
        type:'email',
        componentType:"input"
    }
]

export const updateProfileInitialState={
    userName:"",
    address:"",
    phone:"",
    gender:"",
    DOB:""
}

export const changePasswordInitialState={
    currentPassword:"",
    newPassword:"",
    confirmPassword:"",
}


export const changePasswordForm=[
    {
        label:"Current Password",
        name:"currentPassword",
        placeholder:"Enter current Password",
        type:'password',
        componentType:"input"
    },
    {
        label:"New Password",
        name:"newPassword",
        placeholder:"Make New Password",
        type:'password',
        componentType:"input"
    },
    {
        label:"Confirm Password",
        name:"confirmPassword",
        placeholder:"Confirm Password",
        type:'password',
        componentType:"input"
    }
]


export const becomeTeacherForm=[ 
    {
        label:"Your CV",
        name:"cv",
        placeholder:"Upload Your CV",
        type:'file',
        componentType:"file"
    }
]

export const becomeTeacherInitialState={
   cv:""
}