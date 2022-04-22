import { ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Skeleton, List, Grid, Divider, IconButton } from '@mui/material';
import React from 'react';
import { Add, Remove } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, STATUS_CREATING } from '../actions/types';

const AddChannel = ({ type }) => {
  const dispatch = useDispatch();
  const currentType = useSelector(state => state.type);
  const currentStatus = useSelector(state => state.status);
  const handleClickAddChannel = () => {
    dispatch(changeType(type));
    dispatch(changeStatus(((currentType && currentType !== type) || !currentStatus) ? STATUS_CREATING : RESET_STATUS));
  }

  return (
    <IconButton onClick={handleClickAddChannel}>
      {
        currentType === type && currentStatus === STATUS_CREATING ?
          <Remove /> :
          <Add />
      }
    </IconButton>
  )
};

const Loading = () => (<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Skeleton variant="circular" width={30} height={30} />
    </ListItemIcon>
    <ListItemText primary={
      <Skeleton variant="text" width="100%" height={30} />
    } />
  </ListItemButton>
</ListItem>);

const NotFound = () => (<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
    </ListItemIcon>
    <ListItemText primary={
      <i>Connection error</i>
    } />
  </ListItemButton>
</ListItem>)

const TeamChannelList = ({
  children,
  error = false,
  loading, type,
}) => {
  return (
    <List subheader={
      <ListSubheader disableSticky component="div" id={`${type}-preview-subheader`} sx={{ borderRadius: '25px', pl: 0, pr: 0 }}>
        <>
          <Grid container>
            <Grid item xs={11}>
              {type === 'team' ? 'Channels' : 'Direct Messages'}
            </Grid>
            <Grid item xs={1}>
              <AddChannel type={type || ''} />
            </Grid>
          </Grid>
          <Divider />
        </>
      </ListSubheader>
    } sx={{ pl: 2, pr: 2, pt: 1, pb: 2 }}>
      {
        error ? <NotFound /> : (
          loading ? <Loading /> : children
        )
      }
    </List>
  )
}

export default TeamChannelList