import React, { useEffect, useState } from 'react'

import Header from '../components/Header'
import RoomMembers from '../components/RoomMembers'
import CreateRoom from '../components/CreateRooms'

const Rooms = ({ user, logout }) => {
  const [err, setErr] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  useEffect(() => {
    console.log(selectedUsers)
  }, [selectedUsers])
  return (
    <>
      <Header username={user.username} logout={logout} link={"/"} icon={"bi-wechat"} />
      <div id="rooms">
        <RoomMembers user={user} setErr={setErr} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        <CreateRoom user={user} setErr={setErr} selectedUsers={selectedUsers} />
      </div>
    </>
  )
}

export default Rooms