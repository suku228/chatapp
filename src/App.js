import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { TextField, IconButton,  Menu, MenuItem, Typography, } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const API_URL = process.env.REACT_APP_API_URL;

const socket = io(API_URL); // Connect to backend WebSocket

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserName, setcurrentUserName] = useState("");
  const [login, setLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogin = ()=>{
    setLogin(true);
  }

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    alert("Logging out..."); // Replace with actual logout logic
    handleClose();
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", `${currentUserName}-${message}`);
      setMessage("");
    }
  };

  return (

login?
    <div >
      <div>
        <div style={{margin: "0",
                  padding: "1rem",
                  color: "white",
                  backgroundColor:"green",
                  fontWeight:"bold",
                  fontSize:"24px",
                  display: "flex",
                  justifyContent: "space-between"
                  }}>
                    <Typography variant="h6">Live chat</Typography>
                    <IconButton onClick={handleClick} color="inherit">
                    <AccountCircleIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ marginRight: 1 }} /> Logout
                      </MenuItem>
                    </Menu>
                    </div>

                  
      </div>
      <div style={{
        position:"relative",
        backgroundImage: "url('/image.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "87vh",
        display: "flex",
        fontSize: "24px",
        textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
      }}>
        <div style={{ width:"100%", height:"100%", display: "flex", flexDirection: "column", padding: "10px" }}>
        {messages?.map((msg) => {
          const [userName, msgText] = msg?.split("-");
            return (
                <div 
                  style={{
                    maxWidth: "60%",
                    padding: "10px",
                    margin: "5px",
                    borderRadius: "10px",
                    alignSelf: currentUserName === userName ? "flex-end" : "flex-start",
                    backgroundColor:"#E5E5EA"
                  }}> 
              {msgText}
              </div>
              
            )
          }
          )}
        </div>

        
      </div>

      <div  
        style ={{
        position:"fixed",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        columnGap: "10px",
        backgroundColor:"white",
        width:"100%"
        }}>

        <TextField
          variant="outlined"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message..." 
          style={{
            width:"100%"
          }}
        />


        {message && <IconButton
          sx={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "50%",  // Makes it circular
            width: 50,            // Adjust size
            height: 50,
            "&:hover": { backgroundColor: "#1DAA61" },

          }}
          disabled={!message} 
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>}
    </div>
      
    </div>: 
    
    <div  style ={{
      position:"absolute",
      display: "flex",
      top:"50%",
      left:"50%",
      transform:"translate(-50%,-50%)",
      justifyContent: "center",
      alignItems: "center",
      columnGap: "20px",
      }}>

      <TextField
        variant="outlined"
        placeholder="Username"
        value={currentUserName} onChange={(e)=>setcurrentUserName(e.target.value)}
      />


    {currentUserName && <IconButton
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        borderRadius: "50%",  // Makes it circular
        width: 50,            // Adjust size
        height: 50,
        "&:hover": { backgroundColor: "primary.dark" },

      }}
      color="success"
      onClick={handleLogin}
    >
      <ArrowForwardIcon />
    </IconButton>}
    </div>
   
  );
};

export default App;
