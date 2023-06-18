import React,{useState,useEffect, useCallback} from 'react';
import {Typography,Paper,Button} from "@mui/material";
import type { SxProps } from '@mui/material';

import CustomTextField from "./custom_text_field";
import { Equibundle, SortItem } from './items';

const useStyles: Record<string, SxProps> = {
    form : {
        display : "flex",
        flexDirection : "column",
    },
    container : {
        backgroundColor : "#ffffff",
        position : "absolute",
        top : "50%",
        left : "50%",
        transform : "translate(-50%,-50%)",
        padding : 5,
        textAlign : "center"
    },
    title : {
        margin:"0px 0 20px 0"
    },
    button : {
        margin:"10px 2px"
    }
}

type FormValues = {
    member: string;
    email: string;
  };
  
  const initialValues: FormValues = {
    member: '',
    email: '',
  };
  
  const Form = () => {
    const [values, setValues] = useState<FormValues>(initialValues);
    const [items, setItems] = useState<Array<SortItem>>([]);
    useEffect(() => {
        console.log("Adding...");
        console.log(items);
    },[items])
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };
  
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Submitting " + items);
      const currID = parseInt(localStorage.getItem("currentID") || '0')
      const bundle = new Equibundle(currID,items)
      
      localStorage.setItem("bundle"+currID,JSON.stringify(bundle));
      localStorage.setItem("currentID", (currID + 1).toString());
      setValues(initialValues);
      setItems([]);
    },[items]);
  
    const handleAddMember = () => {
      const newItem = new SortItem(values.member, values.email);
      setItems((prevItems) => [...prevItems, newItem]);
      setValues(initialValues); // Clear the form values
    };
  
    return (
      <Paper sx={useStyles.container}>
        <Typography variant={"h4"} sx={useStyles.title}>Create new family!</Typography>
        <form onSubmit={handleSubmit}>
          <CustomTextField changeHandler={handleChange} label={"Member"} name={"member"} value={values.member}/>
          <CustomTextField changeHandler={handleChange} label={"Email"} name={"email"} value={values.email}/>
          <Button type={"button"} variant={"contained"} sx={useStyles.button} onClick={handleAddMember}>Add new member</Button>
          <Button type={"submit"} variant={"contained"} sx={useStyles.button}>Submit</Button>
        </form>
        <div>
        <Typography variant="h6">Current Members:</Typography>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            maxWidth: '100%',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '5px',
                wordWrap: 'break-word',
                maxWidth: '200px',
              }}
            >
              <Typography>{item.member}</Typography>
            </div>
          ))}
        </div>
      </div>
      </Paper>
    );
  };
  
  export default Form;