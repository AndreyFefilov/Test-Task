import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Divider } from '@material-ui/core';

const DeleteDialog = (props) => {

    const {deleteDialog, setDeleteDialog} = props;

    return (
        <div>
            <Dialog
                open={deleteDialog.isOpen}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <Box style={{padding: 15}}>
                <DialogContent>
                    <Typography variant="h6">
                        {deleteDialog.title}
                    </Typography>
                </DialogContent>
                <Divider/>
                <DialogActions style={{justifyContent: 'center'}}>
                    <Button 
                        autoFocus
                        className="action-btn"
                        variant="contained"
                        color="primary"
                        style={{width: 100}}
                        onClick={deleteDialog.onConfirm}
                    >
                        Удалить
                    </Button>
                    <Button                         
                        onClick={ () => setDeleteDialog({...deleteDialog, isOpen: false})}
                        variant="outlined">
                        Отмена
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
      </div>
    )
}

export default DeleteDialog;
