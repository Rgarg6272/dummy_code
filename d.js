   const checkInput = (updateMemberData) => {
        // const memeberIdButtons = updateMemberData.some((checkInput) => {
        //     if (checkInput) {
        //         return checkInput.value && checkInput.value.length > 0;
        //     }
        // });
        //console.log(updateMemberData)
        const isDelegateValid = updateMemberData[0].value ? updateMemberData[0].value.trim() !== "" : "";
        const isContactTypeValid = updateMemberData[1].value ? updateMemberData[1].value.trim() !== "" : "";
        const isContactNameValid = updateMemberData[2].value ? updateMemberData[2].value.trim() !== "" : "";
        const isCellPhoneValid = updateMemberData[3].value ? (updateMemberData[3].value.length > 11) : "";
        const isWorkPhoneValid = updateMemberData[4].value ? (updateMemberData[4].value.length > 11) : "";
        const preferredContact = updateMemberData[6].value ? updateMemberData[6].value : "";

        
        let shouldEnableButton = false;

        if (!preferredContact) {
            // Preferred Contact is not selected
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                (isCellPhoneValid || isWorkPhoneValid);
        } else if (preferredContact === "Work Phone") {
            // Preferred Contact is "Work Phone"
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                isWorkPhoneValid;
        } else if (preferredContact === "Cell Phone") {
            // Preferred Contact is "Cell Phone"
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                isCellPhoneValid;
        }

        setSearchBtnDisable(!shouldEnableButton);
        setClearBtnDisable(!shouldEnableButton);
    };
