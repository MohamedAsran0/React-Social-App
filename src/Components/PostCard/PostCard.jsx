import { AiTwotoneLike } from 'react-icons/ai'
import { FaComment, FaShare } from 'react-icons/fa'
import CardHeader from '../CardHeader/CardHeader'
import ModalPostDetails from './../ModalPostDetails/ModalPostDetails';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { tokenContextObj } from '../../Context/TokenContextProvider';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function PostCard({ postDetails, postUser, isPostWithComments = false }) {

  const { token } = useContext(tokenContextObj)

  const [openModal, setOpenModal] = useState(false);

  const qClient = useQueryClient();

  const commentInput = useRef(null);

  const { isPending: isCreateCommentPending, mutate: mutateAddComment } = useMutation({
    mutationFn: handleAddComment,
    
    onSuccess: () => {
      toast.success('Comment submitted successfully');
      commentInput.current.value = '';
      qClient.invalidateQueries(['getAllPosts']);
    },
    
    onError: (err) => {
      toast.error(err.message || 'Cannot create comment')
    }
  });

  function handleAddComment() {

    if(commentInput.current.value == '')
    {
      throw new Error('Cannot submit empty comment');
    }

    return axios.post('https://linked-posts.routemisr.com/comments', {
      content: commentInput.current.value,
      post: postDetails._id
    }, {
      headers: {
        token: token
      }
    })
  }

  return (
    <>
      <div className="bg-white  py-8 px-4 shadow sm:rounded-lg sm:px-10">

        <CardHeader postDetails={postDetails} cardUser={postUser} />
        {postDetails.image && <img src={postDetails.image} className='mt-3 w-full' alt="" />}

        <div className='m-3 flex flex-wrap gap-3'>
          <input ref={commentInput} type="text" className='flex-1 min-w-0 rounded-full border text-black font-semibold p-2' placeholder='Write Your Comment...' />
          <button onClick={mutateAddComment} className="py-2 px-5 bg-blue-500 text-white rounded-full hover:bg-blue-700 cursor-pointer">{isCreateCommentPending ? <ClipLoader size={20} /> : 'Comment'}</button>
        </div>

        <div className='flex justify-between mt-3'>
          <div className='flex gap-2 items-center cursor-pointer'>
            <AiTwotoneLike />
            <p>like</p>
          </div>

          {isPostWithComments && <div className='flex gap-2 items-center cursor-pointer'>
            <FaComment />
            <p>{postDetails.comments.length} comments</p>
          </div>}
          {!isPostWithComments && <div onClick={() => setOpenModal(true)} className='flex gap-2 items-center cursor-pointer'>
            <FaComment />
            <p>{postDetails.comments.length} comments</p>
          </div>}

          <div className='flex gap-2 items-center cursor-pointer'>
            <FaShare />
            <p>share</p>
          </div>
        </div>
      </div>


      <ModalPostDetails openModal={openModal} setOpenModal={setOpenModal} postDetails={postDetails} postUser={postUser} />

    </>
  )
}
