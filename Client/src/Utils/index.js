
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


export const formatForAllApplication=['S.N',"ID","UserID","Applicant Name","Date","Status","action"];
export const formatForAllCourses=['S.N',"Course","Students","Date","Revenue","action"];



export const languageOptions = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "chinese", label: "Chinese" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "portuguese", label: "Portuguese" },
    { id: "arabic", label: "Arabic" },
    { id: "russian", label: "Russian" },
  ];


  export const courseLevelOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];



  export const courseCategories = [
    { id: "web-development", label: "Web Development" },
    { id: "backend-development", label: "Backend Development" },
    { id: "data-science", label: "Data Science" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "artificial-intelligence", label: "Artificial Intelligence" },
    { id: "cloud-computing", label: "Cloud Computing" },
    { id: "cyber-security", label: "Cyber Security" },
    { id: "mobile-development", label: "Mobile Development" },
    { id: "game-development", label: "Game Development" },
    { id: "software-engineering", label: "Software Engineering" },
  ];


  export const courseLandingPageFormControls = [
    {
      name: "title",
      label: "Title",
      componentType: "input",
      type: "text",
      placeholder: "Enter course title",
    },
    {
      name: "category",
      label: "Category",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: courseCategories,
    },
    {
      name: "level",
      label: "Level",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: courseLevelOptions,
    },
    {
      name: "primaryLanguage",
      label: "Primary Language",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: languageOptions,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      componentType: "input",
      type: "text",
      placeholder: "Enter course subtitle",
    },
    {
      name: "description",
      label: "Description",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter course description",
    },
    {
      name: "pricing",
      label: "Pricing",
      componentType: "input",
      type: "number",
      placeholder: "Enter course pricing",
    },
    {
      name: "objectives",
      label: "Objectives",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter course objectives",
    },
    {
      name: "welcomeMessage",
      label: "Welcome Message",
      componentType: "textarea",
      placeholder: "Welcome message for students",
    },
  ];
  
  export const courseLandingInitialFormData = {
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    subtitle: "",
    description: "",
    pricing: "",
    objectives: "",
    welcomeMessage: "",
    image: "",
  };
  
  export const courseCurriculumInitialFormData = [
    {
      title: "",
      videoUrl: "",
      freePreview: false,
      public_id: "",
    },
  ];

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];
  
  export const filterOptions = {
    category: courseCategories,
    level: courseLevelOptions,
    primaryLanguage: languageOptions,
  };