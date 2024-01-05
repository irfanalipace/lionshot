import { useState } from 'react';
import { TextareaAutosize, Button, Divider, Typography } from "@mui/material";
import { Box, padding } from "@mui/system";
import FormField from "../../../Components/InputField/FormField";

function Comment({Comments}) {
    const [commentValue, setCommentValue] = useState(""); // State to hold the comment value

    const handleChange = (event) => {
        setCommentValue(event.target.value);
    };
    const isCommentEmpty = commentValue.trim() === "";
    const handleSubmit = () => {
        // Here you can make an API call to submit the comment
        // You can use commentValue to send the comment content to the API
        // For example:
        // apiCallFunction({ comment: commentValue })
    };

    return (
        <>
            <Box style={{ position: 'relative' }}>
                <FormField
                    id="comments"
                    name="comments"
                    multiline
                    minRows="10"
                    style={{ width: "70%", zIndex: '0' }}
                    label={"Comment"}
                    value={commentValue}
                    onChange={handleChange}
                />
            </Box>
            <br />
            <Box sx={{ margin: '-70px 0 50px 2px', padding: '0 0 10px 10px', backgroundColor: 'white', width: '69.6%', zIndex: '1', position: 'relative' }}>
                <Button onClick={handleSubmit} variant="outlined" color="primary" disabled={isCommentEmpty} >
                    Add Comment
                </Button>
            </Box>
            <Box>
                <Typography variant='body1bold'> All Comments</Typography>
                <Divider sx={{width:'70%', margin:'20px 0'}}/>
                <Typography variant='body2'> {Comments}</Typography>
            </Box>
        </>
    );
}

export default Comment;
