import React from "react";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    makeStyles,
    Grid,
} from "@material-ui/core";
import { RxCross2 } from "react-icons/rx";

const useStyles = makeStyles(() => ({
    detailItem: {
        marginBottom: "10px",
    },
    label: {
        fontWeight: 500,
        color: "#ccc",
    },
    value: {
        fontWeight: 600,
        color: "#fff",
    },
    cancelBtn: {
        position: "absolute",
        top: 0,
        right: 0,
        "& svg": {
            color: "#fff",
            fontWeight: "700",
        },
    },
}));

export default function TransactionDetailModal({ open, handleClose, transactionDetail = {} }) {
    const classes = useStyles();

    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            open={open}
            onClose={handleClose}
        >


            <DialogContent style={{ background: "#1e1b26", color: "#fff" }}>

                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.detailItem} textAlign="center">
                        <IconButton onClick={handleClose} className={classes.cancelBtn}>
                            <RxCross2 />
                        </IconButton>
                        <Typography variant="h6" style={{ color: "#fff", fontWeight: 500 , textAlign: "center"}}>
                            Transaction Details
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>User Name</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.userName}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Email</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.email}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Plan Title</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.planTitle}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Price</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.price}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Duration</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.duration}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Purchase Date</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.purchaseDate}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Expiry Date</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.expiryDate}</Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.detailItem}>
                        <Typography variant="body2" className={classes.label}>Status</Typography>
                        <Typography variant="body2" className={classes.value}>{transactionDetail.status}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
