export const NoteTypeData = [
  {
    id: "Note_type",
    placeHolder: "Note Type",
    inputType: "select",
    label: "Note Type",
    name: "Note_type",
    NoteTypeOptions: ["Referral Date", "Date of Care Coordinator Assignment", "Others"],
    //"Select Note Type",
  },
  {
    id: "Note_date",
    placeHolder: "yyyy/mm/dd",
    inputType: "date",
    label: "",
    name: "Note_date",
    format: "YYYY-MM-DD",
    checkRange: false,
  },
];
