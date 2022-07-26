import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import CONFIG from '../config';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide(props) {
  const [textData, setTextData] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      token: data.get('token'),
    });
    handleGetIn(event);
  };

  const handleGenerateToken = async (event) => {
    // console.log(`${CONFIG}/generate_token`);
    let data = await fetch(`${CONFIG}/generate_token`);
    console.log("fetched");
    let parsedData = await data.json()
    console.log("from component did mount",parsedData.token);
    props.generateTokenState({token:parsedData.token, my_turn:0, navigator:navigate, click_enable:true}); 
    navigate("/BingoPage");
    // this.props.history.push("/BingoPage");
    // console.log(`${CONFIG}/generate_token`);
    // let data = await fetch(`${CONFIG}/generate_token`);
    // let parsedData = await data.json()
    // console.log(parsedData);
  };

  const handleGetIn = async (event) => {
    // console.log(`${CONFIG}/set_player`);
    let data = await fetch(`${CONFIG}/set_player?token=${textData}`);
    console.log("fetched");
    let parsedData = await data.json()
    let status_code = parsedData.status_code
    console.log("status_code",status_code);
    if(status_code===200){
      let my_turn = parsedData.my_turn
      console.log("from component did mount",my_turn);
      props.generateTokenState({token:textData, my_turn:parsedData.my_turn, navigator:navigate, click_enable:false});
      navigate("/BingoPage");
    }
    else if(status_code===201){
      console.log("Game is already started...");
    }
    else{
      console.log("Recheck the token");
    }
    // console.log(textData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="token"
                label="Enter Token"
                name="token"
                autoFocus
                onChange={(e)=>{setTextData(e.target.value);}}
              />
              <Button
                onClick={handleGetIn}
                // type="submit"
                // fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Get In
              </Button>
              
              {/* <Link
                href="BingoPage"
                // color="primary"
                // level="h5"
                underline="none"
                // variant="solid"
              > */}
              <Button
                onClick={handleGenerateToken}
                // type="submit"
                // fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 , ml: 2}}
              >
              Generate Token
              </Button>
              {/* </Link> */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}