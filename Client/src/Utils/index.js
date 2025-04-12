
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
    label:'Email',
    name:"email",
    type:"email",
    componentType:"input",
    placeholder:'Enter your email'

},
{
    label:'User Name',
    name:"userName",
    type:"text",
    componentType:"input",
    placeholder:'Enter your User Name'

},
{
    label:'Password',
    name:"password",
    type:"password",
    componentType:"input",
    placeholder:'Create Password'

},
{
    label:'Confirm Password',
    name:"confirmPassword",
    type:"password",
    componentType:"input",
    placeholder:'Password Confirmation'

},
]

export const loginForm=[
    {
    label:'Email',
    name:"email",
    componentType:"input",
    type:'email',
    placeholder:'Enter your email'

},
{
    label:'Password',
    name:"password",
    componentType:"input",
    type:'password',
    placeholder:'Enter Password'

},
{
    label:'Confirm Password',
    name:"confirmPassword",
    componentType:"input",
    type:'password',
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


export const formatForAllApplication=["",'S.N',"Applicant Name","Date","Status","action"];
export const formatForAllCourses=["",'S.N',"Course","Price","Students","Date","Revenue","action"];



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
    { id: "business", label: "Business" }
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
      placeholder: "Enter course objectives seperate each by ,",
    },
    {
      name: "welcomeMessage",
      label: "Welcome Message",
      componentType: "textarea",
      placeholder: "Welcome message for students",
    }
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
    image_public_id:""
  };
  
  export const courseCurriculumInitialFormData = [
    {
      title: "",
      videoUrl: "",
      freePreview: false,
      public_id: "",
    },
  ];


  export const quizOption=
  [{id:"optionA",label:"OptionA"},
    {id:"optionB",label:"OptionB"},
    {id:"optionC",label:"OptionC"},
    {id:"optionD",label:"OptionD"}
]

  export const courseQuizInitialFormData = [
    {
      question: "",
      optionA:"",
      optionB:"",
      optionC:"",
      optionD:"",
      answer: "",
    },
  ];

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
    { id: "create-rtoo", label: "Create: R to O" },
    { id: "create-otor", label: "Create: O to R" }
  ];
  
  export const filterOptions = {
    category: courseCategories,
    level: courseLevelOptions,
    primaryLanguage: languageOptions,
  };

  export const updateTeacherInfoComponents=[
        {
          label: "Certificates ",
          mendatory:true,
          name: "certificate",
          type: "file",
          componentType: "file",
        },
        {
          label: "Degree",
          name: "degree",
          type: "textarea",
          mendatory:false,
          componentType: "textarea",
          placeholder: "Enter your Degrees. seperate each with ,",
        },
        {
          label: "Avilability",
          mendatory:true,
          name: "avilability",
          type: "textarea",
          componentType: "textarea",
          placeholder: "Enter in days. seperate each with , ",
        },
        {
          label: "Description",
          mendatory:true,
          name: "description",
          type: "textarea",
          componentType: "textarea",
          placeholder: "Describe yourself.",
        },
        {
          label: "College",
          name: "college",
          mendatory:false,
          type: "text",
          componentType: "input",
          placeholder: "Your college name.",
        },
        {
          name: "category",
          label: "Category",
          componentType: "select",
          type: "text",
          mendatory:true,
          placeholder: "",
          options: courseCategories,
        },
        {
          name: "primaryLanguage",
          label: "Primary Language",
          componentType: "select",
          mendatory:true,
          type: "text",
          placeholder: "",
          options: languageOptions,
        },
        {
          label: "University",
          name: "university",
          mendatory:false,
          type: "text",
          componentType: "input",
          placeholder: "Your University Name.",
        },
        {
          label: "Fee",
          name: "feePerHour",
          mendatory:true,
          type: "number",
          componentType: "input",
          placeholder: "Fee per Hour",
        },
        {
          label: "Experience",
          name: "experience",
          mendatory:true,
          type: "number",
          componentType: "input",
          placeholder: "In Years",
        }
  ]

export const updateTeacherInfoInitialState=
{
  certificate:"",
  degree:"",
  avilability:"",
  description:"",
  primaryLanguage:"",
  category:"",
  feePerHour:"",
  college:"",
  university:"",
  experience:""
}


export const hireTeacherComponents=[
  {
    label: "Hiring Date",
    name: "hiringDate",
    type: "date",
    componentType: "date",
  },{
    label: "Hire Description",
    name: "hireDescription",
    type: "textarea",
    componentType: "textarea"
  },
  {
    label: "Start Time",
    name: "startTime",
    type: "text",
    componentType: "input",
    placeholder: "Enter your starting time PM/AM",
  },
  {
    label: "End Time",
    name: "endTime",
    type: "text",
    componentType: "input",
    placeholder: "Enter your ending time PM/AM",
  },
]

export const hireTeacherInitialState=
{
  hiringDate:"",
  startTime:"",
  endTime:"",
  hireDescription:""
}


export const formatForHireApplication=["",'S.N',"Student Name","Teacher Name","Requested On","Hiring Date","Time","Status","Action"];

export const formatForTeacherCourses=["",'S.N',"Course","Price","Students","Date","Revenue","Earning","isPublished","Action"];


export const subscriptionPlans = [
  {
    name: 'basic',
    duration: '1 Month',
    price: '1',
    features: [
      'Upload up to 10 courses',
      'Basic analytics dashboard',
      'Teacher profile listing'
    ],
    recommended: false
  },
  {
    name: 'premium',
    duration: '6 Months',
    price: '2',
    features: [
      'Unlimited course uploads',
      'Advanced analytics',
      'Priority support',
      'Featured profile placement',
    ],
    recommended: true
  },
  {
    name: 'elite',
    duration: '1 Year',
    price: '3',
    features: [
      'All Premium features',
      'Verified teacher badge',
      'Early access to new features',
    ],
    recommended: false
  }
];

export const formatForTeacher=["",'S.N',"User Name","email","Courses","Students","Role","Revenue","Status","Action"];
export const formatForCustomer=["",'S.N',"User Name","email","Enrollment","Course Completed","Role","Status","Action"];


export const bannerSlides = [
  {
    title: "Efficient Pathsala - Revolutionizing E-Learning",
    description: "Your gateway to modern, efficient, and personalized education experiences",
    bgColor: "bg-blue-600"
  },
  {
    title: "Learn Anytime, Anywhere",
    description: "Access quality education from the comfort of your home",
    bgColor: "bg-green-600"
  },
  {
    title: "Expert Instructors",
    description: "Learn from industry professionals with real-world experience",
    bgColor: "bg-purple-600"
  },
  {
    title: "Certified Courses",
    description: "Get recognized certificates upon course completion",
    bgColor: "bg-orange-600"
  }
];

export const features = [
  {
    title: "Tech Courses",
    description: "Latest technology courses with hands-on projects"
  },
  {
    title: "Become a Teacher",
    description: "Share your knowledge and earn by teaching"
  },
  {
    title: "Hire Teachers",
    description: "Find expert instructors for personalized learning"
  },
  {
    title: "Certificates",
    description: "Earn recognized certificates upon completion"
  },
  {
    title: "Quizzes",
    description: "Test your knowledge and track progress"
  },
  {
    title: "Flexible Learning",
    description: "Learn at your own pace, anytime"
  }
];