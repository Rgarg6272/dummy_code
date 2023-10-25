 const checkInput = (updateMemberData) => {
      //  console.log("updation",updateMemberData)
        const memeberIdButtons = updateMemberData.some((checkInput) => {
            if(checkInput){
                return checkInput.value && checkInput.value.length > 0;
            }
        });
        if (memeberIdButtons) {
            setSearchBtnDisable(false);
            setClearBtnDisable(false);
        } else {
            setSearchBtnDisable(true);
            setClearBtnDisable(true);
        }
    };
