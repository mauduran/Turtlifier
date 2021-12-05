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

    // Notification Alert
    const [message, setmessage] = useState('');

    // Progress Bar
    const [uploadPercentage, setuploadPercentage] = useState(0);

    // Spinner
    const [loading, setLoading] = useState(true);
    const [uploadInProgress, setUploadInProgress] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/config`)
            .then(res => {
                console.log("Response");
                console.log(res);
                //Set Title Tine to its default value#
                setTitleLineNum(res.data.firstLineToProcess);
                //Set Data Start Line to its default value
                setDataLineNum(res.data.firstLineToProcess);
                //Last line to process to its default value 
                let lastLineToProcessStr = res.data.lastLineToProcess;
                setLastLineToProcess(lastLineToProcessStr ? lastLineToProcessStr : '');//Validate if there is a value. if not use '' value
                //Set Data prefix name to its default value
                let dataPrefixStr = res.data.dataPrefix;
                setDataPrefix(dataPrefixStr.charAt(0));
                //Set Data prefix Uri to its default value
                let dataPrefixUriStr = res.data.dataPrefixUri;
                setDataPrefixUri(dataPrefixUriStr.substring(1).slice(0, -1));
                //Set Prediate prefix to its default value
                let predicatePrefixStr = res.data.predicatePrefix
                setPredicatePrefix(predicatePrefixStr.charAt(0));
                //Set Predicate Uri to its default value
                let predicatePrefixUriStr = res.data.predicatePrefixUri
                setPredicatePrefixUri(predicatePrefixUriStr.substring(1).slice(0, -1));
                //Set Separator to its default value
                setSeparator(res.data.separator);
            });
    }, [])

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('separator', separator);
        formData.append('hasTitles', hasTitles);
        if (titleLineNum && titleLineNum !== "")
            formData.append('titleLineNum', titleLineNum);
        if (dataLineNum && dataLineNum !== "")
            formData.append('dataLineNum', dataLineNum);

        if (lastLineToProcess && lastLineToProcess !== "")
            formData.append('lastLineToProcess', lastLineToProcess);

        if (lastLineToProcess && lastLineToProcess !== "")
            formData.append('lastLineToProcess', lastLineToProcess);

        formData.append('subjectPrefix', dataPrefix);
        formData.append('subjectPrefixUri', dataPrefixUri);
        formData.append('predicatePrefix', predicatePrefix);
        formData.append('predicatePrefixUri', predicatePrefixUri);
        formData.append('hasTitles', hasTitles);

        console.log("FORM DATA");
        console.log(formData);
        try {
            const responseFile = await axios.post('/turtlify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob',
                onUploadProgress: progressEvent => {
                    setuploadPercentage(parseInt(Math.round(progressEvent.loaded * 100 / progressEvent.total)))
                }
            });

            download(responseFile.data, fileName.split('.')[0] + '.ttl');
            setmessage('File Uploaded!');
        } catch (error) {
            if (error.response.status === 500) {
                setmessage("There was a problem with the server");
            } else {
                setmessage(error.response.data.msg)
            }
        }
    }

    const onFileChange = async (e) => {
        if (!e.target.files || !e.target.files.length || !e.target.files[0]) {
            setmessage("No File Added.")
        }
        console.log(e.target);
        setFile(e.target.files[0]);
        setfileName(e.target.files[0].name);
    }



    return (
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
                            value={titleLineNum}
                            onChange={(e) => setTitleLineNum(e.target.value)}
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
                            value={dataLineNum}
                            onChange={(e) => setDataLineNum(e.target.value)}
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
                            contentEditable={false}
                            sx={{ flex: 1, flexGrow: 1, marginLeft: "10px" }}
                            variant="standard"
                            value={fileName}
                        />
                    </Box>
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
