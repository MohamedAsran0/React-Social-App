import { useContext, useState } from 'react';
import userIcon from '../../assets/user_icon.png'
import { Dropdown, DropdownItem } from "flowbite-react";
import { tokenContextObj } from '../../Context/TokenContextProvider';
import { jwtDecode } from 'jwt-decode';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RiseLoader } from 'react-spinners';
import UpdatePostModal from '../UpdatePostModal/UpdatePostModal';
import UpdateCommentModal from '../UpdateCommentModal/UpdateCommentModal';

export default function CardHeader({ postDetails, cardUser, isComment = false }) {

  const [openUpdatePostModal, setOpenUpdatePostModal] = useState(false);
  const [openUpdateCommentModal, setOpenUpdateCommentModal] = useState(false);

  let timeCreated = postDetails.createdAt.slice(0,10) + ' ' + postDetails.createdAt.slice(11,16);  

  const { token } = useContext(tokenContextObj);

  const qClient = useQueryClient();

  const { user } = jwtDecode(token);

  const {isPending: isDelPending ,mutate: mutateDel} = useMutation({
    mutationFn: handleDelete,

    onSuccess: () => {
      toast.success(`${isComment ? 'Comment' : 'Post'} successfully deleted`);
      qClient.invalidateQueries(['getAllPosts']);
    },

    onError: () => {
      toast.error(`${isComment ? 'Comment' : 'Post'} couldn't be deleted`);
    }

  })

  function handleDelete() {
    return axios.delete(`https://linked-posts.routemisr.com/${isComment ? 'comments' : 'posts'}/${postDetails._id}`,{
      headers: {
        token: token
      }
    })
  }

  function handleUpdateModal() {
    if(!isComment) {
      setOpenUpdatePostModal(true);
    }
    else {
      setOpenUpdateCommentModal(true);
    }
  }

  return (
    <>
    {isDelPending && <div className='fixed top-20 left-1/2'>
        <RiseLoader color="#0f4ff1" />
      </div>} 
      
    
      <div className='flex justify-between'>
        <div className='flex gap-3 items-center '>

          {cardUser.photo.split('/').pop() != 'undefined' && <img src={cardUser.photo} className='w-10 h-10' alt={cardUser.name} />}
          {cardUser.photo.split('/').pop() == 'undefined' && <img src={userIcon} className='w-10 h-10' alt={cardUser.name} />}
          <div>
            <h4>{cardUser.name}</h4>
            <p>{timeCreated}</p>
          </div>
        </div>
        {user == cardUser._id && <Dropdown className='p-3' label="" renderTrigger={() => <span className='cursor-pointer text-2xl'>...</span>}>
          <DropdownItem onClick={mutateDel}>Delete</DropdownItem>
          <DropdownItem onClick={handleUpdateModal}>Update</DropdownItem>
        </Dropdown>}

      </div>

      {isComment && postDetails.content && <p className='mt-3'>{postDetails.content}</p>}
      {!isComment && postDetails.body && <p className='mt-3'>{postDetails.body}</p>}

      {!isComment && <UpdatePostModal openModal = {openUpdatePostModal} setOpenModal = {setOpenUpdatePostModal} post = {postDetails}/>}
      {isComment && <UpdateCommentModal openModal = {openUpdateCommentModal} setOpenModal = {setOpenUpdateCommentModal} post = {postDetails}/>}
    </>
  )
}
