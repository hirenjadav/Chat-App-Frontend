import { Button } from 'primereact/button'
import React, { useState } from 'react'
import FontIconWrapper from '../FontIconWrapper';
import './ChatSideBar.scss';

export default function ChatSideBar() {
    const [currentTab, setCurrentTab] = useState("chats");

  return (
    <div className="chat-sidebar">
        <Button
          text
          onClick={() => setCurrentTab('chats')}
          tooltipOptions={{ disabled: currentTab == 'chats' }}
          className={`sidebar-button ${currentTab == 'chats' ? 'active' : ''}`}
          tooltip="Chats">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button
          text
          onClick={() => setCurrentTab('groups')}
          tooltipOptions={{ disabled: currentTab == 'groups' }}
          className={`sidebar-button ${currentTab == 'groups' ? 'active' : ''}`}
          tooltip="Groups">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button
          text
          onClick={() => setCurrentTab('channels')}
          tooltipOptions={{ disabled: currentTab == 'channels' }}
          className={`sidebar-button ${currentTab == 'channels' ? 'active' : ''}`}
          tooltip="Channels">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>
      </div>
  )
}