import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#181529",
    color: "#fff",
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#242030",
    padding: theme.spacing(3),
    overflowY: "auto",
    borderRight: "1px solid #3a3745",
  },
  content: {
    width: "70%",
    backgroundColor: "#242030",
    padding: theme.spacing(3),
    overflowY: "auto",
    position: "relative",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
  },
  userPaper: {
    backgroundColor: "#2f2b3d",
    padding: theme.spacing(2),
    color: "#fff",
    marginBottom: theme.spacing(2),
  },
  chatRow: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  chatBubble: {
    padding: theme.spacing(1.5),
    borderRadius: 18,
    maxWidth: "65%",
    fontSize: "0.95rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  sender: {
    backgroundColor: "#eee",
    color: "#000",
    marginLeft: "auto",
  },
  receiver: {
    backgroundColor: "#413659",
    color: "#fff",
    marginRight: "auto",
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: "#c5c3cd",
  },
  timestamp: {
    fontSize: "0.7rem",
    color: "#a09cb1",
    marginTop: theme.spacing(0.5),
    textAlign: "right",
  },
}));

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 555-123-4567",
    profilePic: "https://i.pravatar.cc/150?img=1",
    status: "Active",
    lastLogin: "2025-05-01 10:00 AM",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 555-765-4321",
    profilePic: "https://i.pravatar.cc/150?img=2",
    status: "Offline",
    lastLogin: "2025-04-30 05:45 PM",
  },
];

const chatHistory = [
  { senderId: 1, message: "Hi Jake, how are you? I saw on the app that we’ve crossed paths several times this week 😊", time: "2:55 PM" },
  { senderId: 2, message: "Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕️", time: "3:02 PM" },
  { senderId: 1, message: "Sure, let’s do it! 😁", time: "3:10 PM" },
  { senderId: 2, message: "Great! I will write later the exact time and place. See you soon!", time: "3:12 PM" },
];

const ChatList = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {/* Left Side - User Details */}
      <Box className={classes.sidebar}>
        <Typography variant="h6" className={classes.sectionTitle}>
          User Details
        </Typography>
        {users.map((user) => (
          <Paper key={user.id} className={classes.userPaper} elevation={0}>
            <Box className={classes.userCard}>
              <Avatar src={user.profilePic} alt={user.name} />
              <Box>
                <Typography variant="subtitle1" color="primary">{user.name}</Typography>
                <Typography variant="body2" style={{ color: "#bbb" }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2"><strong>Phone:</strong> {user.phone}</Typography>
            <Typography variant="body2"><strong>Status:</strong> {user.status}</Typography>
            <Typography variant="body2"><strong>Last Login:</strong> {user.lastLogin}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Right Side - Chat History */}
      <Box className={classes.content}>
        <Typography variant="body1" className={classes.sectionTitle}>
          Today
        </Typography>
        {chatHistory.map((chat, index) => {
          const isSender = chat.senderId === 2;
          return (
            <Box key={index} className={classes.chatRow}>
              <Box
                className={`${classes.chatBubble} ${
                  isSender ? classes.sender : classes.receiver
                }`}
              >
                <Typography variant="body2">{chat.message}</Typography>
                <Typography className={classes.timestamp}>{chat.time}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ChatList;
