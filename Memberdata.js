export const AdDelegateContactData = [
  {
    id: 1,
    placeHolder: "Enter Delegate",
    inputType: "select",
    label: "Delegate*",
    name: "Delegate",
    DelegateLevelOptions: ["PMS", "PMG", "Health Home - Carelink(Clovis)"],
    Action: "",
    enableDatePicker: false
  },
  {
    id: 2,
    placeHolder: "Enter Contact Type",
    inputType: "select",
    label: "Contact Type*",
    name: "Contact_Type",
    DelegateLevelOptions: ["Care Team - Delegated Care Coordinator", "Delegated Care Coordinator", "CareLink Care Coordinator"],
    Action: "",
    enableDatePicker: false
  },
  {
    id: 3,
    placeHolder: "First Name Last Name",
    inputType: "text",
    label: "Contact Name*",
    name: "Contact_Name",
    Action: "",
    enableDatePicker: false
  },
  {
    id: 4,
    placeHolder: "Enter Cell Phone",
    inputType: "number",
    label: "Cell Phone",
    name: "Cell_Phone",
    Action: "",
    enableDatePicker: false,
    maxLength: 10,
    pattern: "\\d*",
    errorMessage: "Should be a maximum of 10 Digit.",
    hasError: false,
  },
  {
    id: 5,
    placeHolder: "Enter Work Phone",
    inputType: "number",
    label: "Work Phone",
    name: "Work_Phone",
    Action: "",
    enableDatePicker: false,
    maxLength: 10,
    pattern: "\\d*",
    errorMessage: "Should be a maximum of 10 Digit.",
    hasError: false,
  },
  {
    id: 6,
    placeHolder: "Enter Email",
    inputType: "text",
    label: "Email",
    name: "Email",
    Action: "",
    enableDatePicker: false,
    
  },
  {
    id: 7,
    placeHolder: "Enter Preferred Contact",
    inputType: "select",
    label: "Preferred Contact",
    name: "Preferred",
    DelegateLevelOptions: ["Cell Phone", "Work Phone"],
    Action: "",
    enableDatePicker: false
  },
];
