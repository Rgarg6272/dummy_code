{
                                title: "Subscriber ID",
                                field: "SubscriberID",
                                filtering: true,
                                cellStyle: {
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 170,
                                    maxWidth: 170,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem" }}
                                    type="search"
                                    placeholder='Search'
                                    variant="outlined"
                                    onKeyDown={handleButtonSearch}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,
                                render: (rowData) => (
                                    <RenderValue value={rowData.SubscriberID} />
                                ),
                            },
