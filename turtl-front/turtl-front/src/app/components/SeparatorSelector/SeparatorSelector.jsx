
/*
############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################
*/
import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SeparatorSelector({ onChange, separator }) {
    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
                <InputLabel id="separator-helper-label">Separator</InputLabel>
                <Select
                    labelId="separator-helper-label"
                    id="separator-select-helper"
                    value={separator}
                    label="Separator"
                    onChange={onChange}
                    
                >
                    <MenuItem value={","}>Comma ',' </MenuItem>
                    <MenuItem value={";"}>Semicolon ';' </MenuItem>
                    <MenuItem value={"|"}>Pipe '|' </MenuItem>
                    <MenuItem value={" "}>Space</MenuItem>
                    <MenuItem value={"\t"}>Tab</MenuItem>
                </Select>

            </FormControl>
        </div>
    )
}
