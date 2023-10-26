  const handleChange = (event) => {
        if (addHeader === 'Add New Level of Care') {
            setMemberFormData({
                ...memberFormData,
                [event.target.name]: event.target.value,
            });
        } else {
            setMemberContactData({
                ...memberContactData,
                [event.target.name]: event.target.value,
            });
        }

        const fieldValue = event.target.value;
        const cleanedValue = fieldValue
        const updateMemberData = delegateData.map((inputData) => {
            if (inputData.name === event.target.name) {
              //  console.log("input data", event.target.name, event.target.value)
                return {
                    ...inputData,
                    value: length <= 10 ? event.target.value : inputData.value,
                    hasError:(event.target.name === "Cell_Phone" || event.target.name === "Work_Phone") && event.target.value.replace(/\D/g, '').length < 10,
                };
            } else {
                return {
                    ...inputData,
                };
            }
        });
        setDelegateInputData(updateMemberData);
        checkInput(updateMemberData);

    };
