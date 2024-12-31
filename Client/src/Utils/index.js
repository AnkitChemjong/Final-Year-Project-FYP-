export const NavItem=
[ 
{
 name:"Home",
 path:"/",
 show:true
},
{
    name:"Register",
    path:"signup",
    show:true
},
{
    name:"Login",
    path:"signin",
    show:true
},
]

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