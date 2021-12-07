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

import './TurtlForm.css';
import download from "downloadjs";
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SeparatorSelector from '../../components/SeparatorSelector/SeparatorSelector';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Switch, Box } from '@mui/material';

const Input = styled('input')({
    display: 'none',
});

const DarkButton = styled(Button)({
    backgroundColor: "#282c34",
    color: "white",
    textTransform: 'none',
    '&:hover': {
        backgroundColor: "#424957",
    },
});


export default function TurtlForm() {

    // Definition of state, yields a variable holding a state and a function to change it.
    const [separator, setSeparator] = useState(",");
    const [hasTitles, setHasTitles] = useState(true);
    const [titleLineNum, setTitleLineNum] = useState("");
    const [dataLineNum, setDataLineNum] = useState("");
    const [lastLineToProcess, setLastLineToProcess] = useState("");
    const [dataPrefix, setDataPrefix] = useState("s")
    const [dataPrefixUri, setDataPrefixUri] = useState("https://ex.org/data/");
    const [predicatePrefix, setPredicatePrefix] = useState("pred");
    const [predicatePrefixUri, setPredicatePrefixUri] = useState("https://ex.org/pred#");
    const [file, setFile] = useState('');
    const [fileName, setfileName] = useState("");
    const [loaded, setLoaded] = useState(false)
    const [errorLoading, seterrorLoading] = useState(false)

    // Notification Alert
    const [message, setmessage] = useState('');

    useEffect(() => {
        // Get default configuration from server (which reads from config.ini file)
        axios.get(`/config`)
            .then(res => {
                if (res.status !== 200) setLoaded(true);
                //Set Title Tine to its default value#
                setTitleLineNum(parseInt(res.data.titleLineNum || ''));
                //Set Data Start Line to its default value
                setDataLineNum(parseInt(res.data.dataLineNum || ''));

                //Last line to process to its default value 
                let lastLineToProcessStr = res.data.lastLineToProcess;
                setLastLineToProcess(lastLineToProcessStr ? parseInt(lastLineToProcessStr) : '');//Validate if there is a value. if not use '' value
                //Set Data prefix name to its default value
                let dataPrefixStr = res.data.dataPrefix;
                setDataPrefix(dataPrefixStr.replace(":", ""));
                //Set Data prefix Uri to its default value
                let dataPrefixUriStr = res.data.dataPrefixUri;
                setDataPrefixUri(dataPrefixUriStr.replace("<", "").replace(">", ""));
                //Set Prediate prefix to its default value
                let predicatePrefixStr = res.data.predicatePrefix
                setPredicatePrefix(predicatePrefixStr.replace(":", ""));
                //Set Predicate Uri to its default value
                let predicatePrefixUriStr = res.data.predicatePrefixUri

                setPredicatePrefixUri(predicatePrefixUriStr.replace("<", "").replace(">", ""));
                //Set Separator to its default value
                setSeparator(res.data.separator);

            });
    }, [])

    const onSubmit = async e => {
        //Prevent from from posting
        e.preventDefault();
        seterrorLoading(false)

        // Formation of body to call turtle server.
        const formData = new FormData();

        // Add file to file, separator and has_titles to body
        formData.append('file', file);
        formData.append('separator', separator);
        formData.append('has_titles', hasTitles);

        /*  
            Add title_line_num to body. 
            if file does not have titles then this field is not important.
            if file has titles and the user set a title line number, use it.
            if no value if provided use 1 as a default. 
        */
        if (!hasTitles)
            formData.append('title_line_num', -1);
        else if (titleLineNum && titleLineNum !== "")
            formData.append('title_line_num', titleLineNum);
        else
            formData.append('title_line_num', 1);

        /*  
            Add data_line_num to body. 
            if user has set the value use that
            if user did not provide value and file has no titles, use first line as default
            if user did not provide value and file has titles, use second line as default
        */
        if (dataLineNum && dataLineNum !== "")
            formData.append('data_line_num', dataLineNum);
        else if (!hasTitles)
            formData.append('data_line_num', 1);
        else
            formData.append('data_line_num', 2);

        /*  
            Add last line to process to body. 
            If no value is defined use -1 as a value (this value is ignored in the server)
        */
        if (lastLineToProcess && lastLineToProcess !== "")
            formData.append('last_line_to_process', lastLineToProcess);
        else
            formData.append('last_line_to_process', -1);

        // Append required arguments to body
        formData.append('prefix_data', dataPrefix);
        formData.append('prefix_data_uri', dataPrefixUri);
        formData.append('prefix_predicate', predicatePrefix);
        formData.append('prefix_predicate_uri', predicatePrefixUri);
        formData.append('has_titles', hasTitles);


        // Send request to turtlify to server
        try {
            const responseFile = await axios.post('/turtlify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob',
            });

            // Save file with the name the user stated.
            download(responseFile.data, fileName.split('.')[0] + '.ttl');
        } catch (error) {
            // Indicates what happened if there is an error
            if (error.response.status === 500) {
                setmessage("There was a problem with the server");
                seterrorLoading(true)
            } else {
                setmessage(error.response.data.msg)
                seterrorLoading(true)
            }
        }
    }

    // Function that handles when there was a change in a file input
    const onFileChange = async (e) => {
        
        // If target has file, store it in state.
        if (e.target.files && e.target.files.length) {
            setFile(e.target.files[0]);
            setfileName(e.target.files[0].name.replace(".csv", ""));
        } else {
            //if not. Leave state empty
            setmessage("No File Added.")
            setFile(null);
            setfileName("");
        }
    }

    return (
        //Layout for the webpage
        <Card sx={{
            minWidth: "370px",
            width: "35%",
            minHeight: "700px",
            height: "80vh",
            marginBottom: "15px",
        }}>
            <form
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column"
                }}
                onSubmit={onSubmit} >
                <CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "start", justifyContent: "space-between" }}>
                    <Typography variant="h2" sx={{ width: "100%", fontSize: 22, textAlign: "center" }} color="text.primary" gutterBottom>
                        Convert your csv files into Turtl RDF triples!
                    </Typography>
                    {
                        (loaded && <span style={{ color: 'red', fontSize: '12px' }}>There was an error loading the configuration values from the config.ini file</span>)
                    }
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hasTitles}
                                    onChange={() => setHasTitles((prevHasTitles) => !prevHasTitles)} />
                            }
                            labelPlacement="start"
                            label="File with titles" />
                    </FormGroup>
                    <div className="dividr">
                        <Typography variant="h3" sx={{ width: "100%", fontSize: 18 }} color="text.secondary" gutterBottom>
                            Optional
                        </Typography>
                    </div>

                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%"
                        }} >
                        <TextField
                            id="title-line-number"
                            label="Title line #"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ width: "48%" }}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            variant="standard"
                            disabled={!hasTitles}
                            required
                            value={hasTitles ? titleLineNum || "" : -1}
                            onChange={(e) => setTitleLineNum(parseInt(e.target.value))}
                        />

                        <TextField
                            id="data-line-number"
                            label="Data start line #"
                            type="number"
                            sx={{ width: "48%" }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            variant="standard"
                            required
                            value={dataLineNum || ""}
                            onChange={(e) => setDataLineNum(parseInt(e.target.value))}
                        />

                    </Box>

                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: "10px"
                        }} >
                        <TextField
                            id="last-line-to-read"
                            label="Last line to process"
                            type="number"
                            sx={{ width: "48%" }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            value={lastLineToProcess}
                            onChange={(e) => setLastLineToProcess(e.target.value)}
                            variant="standard"
                        />
                    </Box>


                    <div className="dividr" />

                    <SeparatorSelector onChange={(e) => { setSeparator(e.target.value) }} separator={separator} />

                    <div style={{ width: "100%" }}>
                        <Typography variant="h3" sx={{ fontSize: 16 }} color="text.primary">
                            Data prefix
                        </Typography>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }} >
                            <TextField
                                id="subject-prefix-name"
                                label="Name"
                                InputProps={{
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                                variant="standard"
                                sx={{
                                    marginTop: "10px",
                                    width: "30%",
                                }}
                                value={dataPrefix}
                                required
                                onChange={(e) => setDataPrefix(e.target.value)} />

                            <TextField
                                id="subject-prefix-uri"
                                label="Uri"
                                InputProps={{
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                                variant="standard"
                                sx={{
                                    marginTop: "10px",
                                    minWidth: "68%",
                                }}
                                value={dataPrefixUri}
                                required
                                onChange={(e) => setDataPrefixUri(e.target.value)} />

                        </Box>
                    </div>

                    <div style={{ width: "100%", }}>
                        <Typography variant="h3" sx={{ fontSize: 16, marginTop: "10px" }} color="text.primary">
                            Predicate prefix
                        </Typography>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }} >
                            <TextField
                                id="subject-prefix-name"
                                label="Name"
                                InputProps={{
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                                variant="standard"
                                sx={{
                                    marginTop: "10px",
                                    width: "30%",
                                }}
                                value={predicatePrefix}
                                required
                                onChange={(e) => setPredicatePrefix(e.target.value)} />

                            <TextField
                                id="subject-prefix-uri"
                                label="Uri"
                                InputProps={{
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                                variant="standard"
                                sx={{
                                    marginTop: "10px",
                                    minWidth: "68%",
                                }}
                                value={predicatePrefixUri}
                                required
                                onChange={(e) => setPredicatePrefixUri(e.target.value)} />

                        </Box>
                    </div>

                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginTop: "10px"
                        }} >

                        <label htmlFor="contained-button-file">
                            <Input accept="text/csv" id="contained-button-file" type="file" onChange={onFileChange} />
                            <DarkButton component="span" variant="contained">
                                Upload CSV file
                            </DarkButton>
                        </label>

                        <TextField
                            id="file-name"
                            label="File name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(event) => setfileName(event.target.value)}
                            sx={{ flex: 1, flexGrow: 1, marginLeft: "10px" }}
                            variant="standard"
                            required
                            value={fileName}
                        />
                    </Box>
                    {
                        (errorLoading && <span style={{ color: 'red', fontSize: '12px' }}>There was an error procesing the file, there was a problem with the server</span>)
                    }
                </CardContent>

                <div className="dividr" />

                <CardActions sx={{ marginBottom: "10px", height: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DarkButton size="large" variant="contained" component="button" type="submit">
                        Generate Turtl File
                    </DarkButton>
                </CardActions>

            </form>
        </Card>
    );
}
