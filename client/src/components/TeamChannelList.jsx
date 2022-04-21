import { ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Skeleton, List, Grid, Divider } from '@mui/material';
import React from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
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
    <div onClick={handleClickAddChannel}>
      {
        currentType === type && currentStatus === STATUS_CREATING ?
          <AiOutlineMinus /> :
          <AiOutlinePlus />
      }
    </div>
  )
};

const Loading = () => (<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Skeleton variant="circular" width={24} height={24} />
    </ListItemIcon>
    <ListItemText primary={
      <Skeleton variant="text" width="100%" height={24} />
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
      <ListSubheader component="div" id={`${type}-preview-subheader`} sx={{ borderRadius: '25px' }}>
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
    }>
      {
        error ? <NotFound /> : (
          loading ? <Loading /> : children
        )
      }
    </List>
  )
}

export default TeamChannelList