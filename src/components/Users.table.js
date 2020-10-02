import React, {forwardRef, useRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Button, InputAdornment, TextField, Toolbar, PersonAddIcon } from '@material-ui/core';
import { UsersService, LS_USERS_KEY } from '../services/UsersService';
import { OrganisationService } from '../services/OrganisationService';
import UserDialog from '../components/User.dialog';
import DeleteDialog from '../components/Delete.dialog'
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


const orgSrv = new OrganisationService();
const orgsFromJson = orgSrv.getOrganisations().organisations;

const usersSrv = new UsersService();

function getOrganisationName(user) {
    const org = orgsFromJson.find(org => user.organisationId === org.id);
    if(!org) return null;
    return org.shortName;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'firstName', numeric: false, disablePadding: true, label: 'Пользователь' },
  { id: 'organisationId', numeric: true, disablePadding: false, label: 'Организация' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'tools', numeric: true, disablePadding: false, label: '', disableSorting: true },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
        <TableHead>
        <TableRow>
            <TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all users' }}
            />
            </TableCell>
            {headCells.map((headCell) => (
            <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                >
                {headCell.label}
                {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                ) : null}
                </TableSortLabel>
            </TableCell>
            ))}
        </TableRow>
        </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {

  const userSrv = new UsersService();

  const classes = useStyles();
  const [users, setUsers] = React.useState(userSrv.getUsers());
  const [userForUpdate, setUserForUpdate] = React.useState(null);
  const [organisations, setOrganisation] = React.useState(orgsFromJson);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Пользователь');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterUsers, setFilterUsers] = React.useState({func: items => {return items}});
  const [openUserDialog, setOpenUserDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState({isOpen: false, title: ""});
  const [manyUsersDelete, setManyUsersDelete] = React.useState(false);

  const createOrUpdateUser = (newUsers) => {
    setUsers(newUsers);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );

    }
    console.log(newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  const handleUserSearch = (event) => {
    let target = event.target;
    setFilterUsers({
        func: items => {
            if (target.value == "")
                return items;
            else
                return items.filter
                    (x => x.firstName
                        .toLowerCase()
                        .includes(target.value))
        }
    })
  }

  const updateUser = (event, user) => {
    event.stopPropagation();
    setUserForUpdate(user);
    setOpenUserDialog(true);
  }

  const deleteUser = (event, id) => {
    event.stopPropagation();
    setDeleteDialog({
      ...deleteDialog,
      isOpen: false
    })
    let newUsers = usersSrv.deleteUser(id);
    setUsers(newUsers);
  }

  const deleteSelectedUsers = () => {
    setManyUsersDelete(true);
    setDeleteDialog({
      ...deleteDialog,
      isOpen: false
    })
    let newUsers = userSrv.deleteSelectedUsers(selected);
    setUsers(newUsers);
  }

  const userDialogRef = useRef();

  return (
    <div className={classes.root}>
      <UserDialog
        organisations={organisations}
        users={users}
        createOrUpdateUser={createOrUpdateUser}
        userForUpdate={userForUpdate}
        openUserDialog={openUserDialog}
        ref={userDialogRef}
    />
      <Paper className={classes.paper}>
        <Toolbar>
            <Box className="actions-table-block">
                <Box className="actions-table-block__input-block">
                    <TextField
                        className="actions-table-block__input-block__search-input"
                        variant="outlined"
                        label="Поиск по фамилии"
                        size="small"
                        onChange={handleUserSearch}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Box>
                    <Button variant
                    disabled={selected.length == 0}
                    onClick={() => {
                      setDeleteDialog({
                        isOpen: true,
                        title: "Подтвердите удаление",
                        onConfirm: () => {deleteSelectedUsers()}
                      })
                    }}>
                        Удалить выбранные
                    </Button>
                </Box>
            </Box>
        </Toolbar>
        <Box className="table-horisontal-line"/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(filterUsers.func(users), getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => {
                  const isItemSelected = isSelected(user.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, user.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={user.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {user.firstName} {user.lastName} {user.middleName}
                      </TableCell>
                      <TableCell align="right">
                          {getOrganisationName(user)}
                        </TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">
                        <Box>
                          <button
                            className="table-tools edit-button"
                            onClick={(event) => {
                              updateUser(event, user);
                              userDialogRef.current.handleClickOpenUpdateDialog();
                            }}
                          >
                            <EditIcon/>
                          </button>
                          <button
                            className="table-tools delete-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeleteDialog({
                                isOpen: true,
                                title: "Подтвердите удаление",
                                onConfirm: (event) => {deleteUser(event, user.id)}
                              })
                            }}
                          >
                            <DeleteIcon/>
                          </button>
                        </Box>  
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count} строк`}
        />
      </Paper>
      <DeleteDialog
        deleteDialog = {deleteDialog}
        setDeleteDialog = {setDeleteDialog}
        oneOrMoreDelete = {manyUsersDelete}
      />
    </div>
  );
}