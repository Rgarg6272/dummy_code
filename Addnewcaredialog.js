   const checkInput = (updateMemberData) => {
        const isDelegateValid = updateMemberData[0].value ? updateMemberData[0].value.trim() !== "" : "";
        const isContactTypeValid = updateMemberData[1].value ? updateMemberData[1].value.trim() !== "" : "";
        const isContactNameValid = updateMemberData[2].value ? updateMemberData[2].value.trim() !== "" : "";
        const isCellPhoneValid = updateMemberData[3].value ? (updateMemberData[3].value.length > 11) : "";
        const isWorkPhoneValid = updateMemberData[4].value ? (updateMemberData[4].value.length > 11) : "";
        const isCellPhone = updateMemberData[3].value ? updateMemberData[3].value : "";
        const isWorkPhone = updateMemberData[4].value ? updateMemberData[4].value : "";
        const preferredContact = updateMemberData[6].value ? updateMemberData[6].value : "";
        //console.log("preferredContact:",preferredContact)
        let shouldEnableButton = false;
        let shouldEnableClearButton = false;
        /// console.log("preferredContact:", updateMemberData[6].value)
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
        //email validation handling
        if (isDelegateValid && isContactTypeValid && isContactNameValid && (isCellPhoneValid || isWorkPhoneValid)) {
            if (emailLen >= 1 && validEmail == false) {
                shouldEnableButton = false;
            } else if (emailLen >= 1 && validEmail == true) {
                shouldEnableButton = true;
            } else if (emailLen == 0 || emailLen == 1) {
                shouldEnableButton = true;
            }
        }
        //clear all btn handling
        if (isDelegateValid || isContactTypeValid || isContactNameValid || isCellPhone || isWorkPhone || emailLen >= 1 || preferredContact) {
            shouldEnableClearButton = true;
        } else {
            shouldEnableClearButton = false;
        }
        setSearchBtnDisable(!shouldEnableButton);
        setClearBtnDisable(!shouldEnableClearButton);
    };
