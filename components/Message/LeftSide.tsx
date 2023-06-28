import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectOnline } from '@/redux/reducers/onlineReducers'
import { selectAuth } from '@/redux/reducers/authReducers'
import { useRouter } from 'next/router'
import { addUser, checkOnlineOffline, getConversations, getConversationsAsync, selectMessage } from '@/redux/reducers/messageReducers'
import UserCard from '../UserCard'
import { searchUser } from '@/redux/apis/userAPI'
import { useAppDispatch } from '@/redux/store'
// import { getDataAPI } from '../../utils/fetchData'
// import { GLOBALTYPES } from '../../redux/actions/globalTypes'
// import { useHistory, useParams } from 'react-router-dom'
// import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'


const LeftSide = () => {
    const auth = useSelector(selectAuth)?.data
    const online = useSelector(selectOnline)
    const message = useSelector(selectMessage)
    
    
    const dispatch = useAppDispatch()

    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])
    
    const history = useRouter()
    const { id } = useRouter().query

    const pageEnd = useRef(null)
    const [page, setPage] = useState(0)

    
    const handleSearch = async (e: any) => {
        e.preventDefault()
        if(!search) return setSearchUsers([]);
        try {
            const res = await searchUser(search)
            setSearchUsers(res.users)
        } catch (err) {
            // dispatch({
            //     type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            // })
        }
    }

    const handleAddUser = (user: any) => {
        setSearch('')
        setSearchUsers([])
        dispatch(addUser({...user, text: '', media: []}))
        dispatch(checkOnlineOffline(online))
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user:any) => {
        if(id === user._id) return 'active';
        return ''
    }

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversationsAsync({auth, page: 1}))
    },[dispatch, auth, message.firstLoad])

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                setPage(p => p + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current as any)
    },[setPage])

    useEffect(() => {
        if(message.resultUsers >= (page - 1) * 9 && page > 1){
            dispatch(getConversations({auth, page}))
        }
    },[message.resultUsers, page, auth, dispatch])
    

    // Check User Online - Offline
    useEffect(() => {
        if(message.firstLoad) {
            // dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
            dispatch(checkOnlineOffline(online))
        }
    },[online, message.firstLoad, dispatch])

    return (
        <>
            <form className="message_header" onSubmit={handleSearch} >
                <input type="text" value={search}
                placeholder="Enter to Search..."
                onChange={e => setSearch(e.target.value)} />

                <button type="submit" style={{display: 'none'}}>Search</button>
            </form>

            <div className="message_chat_list">
                {
                    searchUsers.length !== 0
                    ?  <>
                        {
                            searchUsers.map((user: any) => (
                                <div key={user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                    <UserCard user={user} />
                                </div>
                            ))
                        }
                        
                    </>
                    : <>
                        {
                            message.users && message.users.map(user => (
                                <div key={user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                    <UserCard user={user} msg={true}>
                                        {
                                            user.online
                                            ? <i className="fas fa-circle text-success" />
                                            : auth.user.following.find((item: any) => 
                                                item._id === user._id
                                            ) && <i className="fas fa-circle" />
                                                
                                        }
                                        
                                    </UserCard>
                                </div>
                            ))
                        }
                    </>
                }
               
               <button ref={pageEnd as any} style={{opacity: 0}} >Load More</button>
            </div>
        </>
    )
}

export default LeftSide
