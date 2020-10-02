import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UsersService } from '../services/UsersService';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginBottom: 20,
        width: 350
    },
    dialog: {
        maxWidth: 465,
        margin: '0 auto'
    }
  }));

  const initialFormValues = {
    id: 0,
    firstName: '',
    lastName: '',
    middleName: '',
    organisationId: '',
    email: ''
};

const UserDialog = forwardRef((props, ref) => {
    useImperativeHandle(
        ref,
        () => ({
            handleClickOpenUpdateDialog() {
                setCreateOrUpdate("update");
                setDialogTitle("Изменение пользователя");
                setOpenUserDialog(true);
            }
        }),
    )

    const classes = useStyles();

    const userSrv = new UsersService();

    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState();
    const [values, setValues] = useState(initialFormValues);
    const [errors, setErros] = useState({});
    const [canUseBtn, setCanUseBtn] = useState(false);
    const [createOrUpdate, setCreateOrUpdate] = useState(); // 2 values: create or update
    const options = props.organisations;

    const validate = (newValues) => {
        let validators = {};

        validators.firstName = newValues.firstName ? "" : "Введите фамилию";
        validators.lastName = newValues.lastName ? "" : "Введите имя";
        if(createOrUpdate == "update") {
            validators.organisationId = newValues.organisationId.length != 0 ? "" : "Выберите организацию";
        }
        validators.email = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/)
        .test(newValues.email) ? "" : "Введите корректную почту";

        setErros({
            ...validators
        })
        
        return Object.values(validators).every(val => val == "");
    }

    const handleInputChange = e => {
        const {name, value} = e.target;
        const newValues = ({
            ...values,
            [name]: value
        });

        setValues(newValues);
        setCanUseBtn(validate(newValues));
    }

    const resetFormValues = () => {
        setValues(initialFormValues);
        setErros([]);
    }

    const handleClose = () => {
        setOpenUserDialog(false);
        setCanUseBtn(false);
        resetFormValues();
      };

    const createNewUser = () => {
        let newUsers = userSrv.createUser(values);
        props.createOrUpdateUser(newUsers);
        handleClose();
    }

    const updateUser = () => {
        let updatedUsers = userSrv.updateUser(values);
        props.createOrUpdateUser(updatedUsers);
        handleClose();
    }

    const handleClickOpenNewUserDialog = () => {
        setCreateOrUpdate("create");
        setDialogTitle("Новый пользователь");
        setOpenUserDialog(true);
    };

    useEffect(() => {
        if (props.userForUpdate) {
            setValues({
                ...props.userForUpdate
            })
        }
    }, [props.userForUpdate])
    
    return (
        <>
            <Box className="add-btn-block">
                <Button     
                    className="action-btn"
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenNewUserDialog}
                    style={{width: 260}}
                    startIcon={<PersonAddIcon/>}
                >
                    Добавить пользователя
                </Button>
            </Box >

            <Dialog
                className={classes.dialog}
                open={openUserDialog}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <form
                    autoComplete="off"
                >
                    <DialogTitle id="form-dialog-title">
                        <Typography variant="h6">
                            {dialogTitle}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                    <TextField
                        className={classes.textField}
                        autoFocus
                        margin="dense"
                        id="firstName"
                        name="firstName"
                        label="Фамилия"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required={true}
                        value={values.firstName}
                        onChange={handleInputChange}
                        error={null}
                        {...(errors.firstName && {error: true, helperText: errors.firstName})}
                    />

                    <TextField
                        className={classes.textField}
                        margin="dense"
                        id="lastName"
                        name="lastName"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required={true}
                        value={values.lastName}
                        onChange={handleInputChange}
                        error={null}
                        {...(errors.lastName && {error: true, helperText: errors.lastName})}
                    />
                    
                    <TextField
                        className={classes.textField}
                        margin="dense"
                        id="middleName"
                        name="middleName"
                        label="Отчество"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                        value={values.middleName}
                    />
                    {createOrUpdate == "update" &&
                        <FormControl 
                            className={classes.textField}
                            variant="outlined"
                            required={true}
                            size="small"             
                        >
                            <InputLabel id="simple-select-label">Организация</InputLabel>
                            <Select
                                labelId="simple-select-label"
                                label="Организация"
                                name="organisationId"
                                value={values.organisationId}
                                onChange={handleInputChange}
                                options={props.organisations}
                                error={null}
                            >
                            <MenuItem value="">
                                <em>Не выбрана</em>
                            </MenuItem>
                            {
                                options.map(org => (
                                    <MenuItem key={org.id} value={org.id}>
                                        {`${org.fullName} (${org.shortName})`}
                                    </MenuItem>
                            ))}
                            </Select>
                            {errors.organisationId &&
                                <FormHelperText style={{color: 'red'}}>
                                    {errors.organisationId}
                                </FormHelperText>}
                        </FormControl>
                    }
                    <TextField
                        className={classes.textField}
                        margin="dense"
                        id="email"
                        name="email"
                        label="E-mail"
                        type="email"
                        fullWidth
                        variant="outlined"
                        required={true}
                        onChange={handleInputChange}
                        value={values.email}
                        error={null}
                        {...(errors.email && {error: true, helperText: errors.email})}
                        
                    />
                    </DialogContent>
                    <DialogActions>
                    {createOrUpdate == "create" &&
                        <Button
                            className="action-btn"
                            variant="contained"
                            color="primary"
                            style={{width: 100}}
                            onClick={createNewUser}
                            disabled={canUseBtn === false}
                        >
                            Добавить
                        </Button>
                    }
                    {createOrUpdate == "update" &&
                        <Button
                            className="action-btn"
                            variant="contained"
                            color="primary"
                            style={{width: 100}}
                            onClick={updateUser}
                            disabled={canUseBtn === false}
                        >
                            Изменить
                        </Button>
                    }
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                    >
                        Отмена
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Box className="table-block">

            </Box>
        </>
    )
})

export default UserDialog;

