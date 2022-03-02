import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ContextProvider } from '../../SocketContext';

import VideoPlayer from './VideoPlayer';
import Sidebar from './Options';
import Notifications from './Notifications';


const Call = () => {
  
  
  return (
      <ContextProvider>
        <div style={{background:`url('${"gs://adoose-3a465.appspot.com/chat_background.jpg"}')`}}>
            <VideoPlayer />
        </div>
    </ContextProvider>
  );
};

export default Call;