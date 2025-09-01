import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext, useRef } from 'react'
import { tokenContextObj } from '../../Context/TokenContextProvider'
import { RiseLoader } from 'react-spinners'
import PostCard from '../PostCard/PostCard'
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify'


export default function Profile() {

  const { token } = useContext(tokenContextObj);

  const decoded = jwtDecode(token);

  const imageUpload = useRef(null);

  const qClient = useQueryClient();


  function getUserPosts() {
    return axios.get(`https://linked-posts.routemisr.com/users/${decoded.user}/posts?limit=20`, {
      headers: {
        token: token
      }
    });
  }


  const { data, isLoading, isError } = useQuery({
    queryKey: ['getUserPosts'],
    queryFn: getUserPosts,
  })

  const { isPending: isUploadImagePending, mutate: mutateHandleImageUploaded } = useMutation({
    mutationFn: handleImageUploaded,

    onSuccess: () => {
      imageUpload.current.value = '';
      toast.success('Image updated successfully');
      qClient.invalidateQueries(['getUserPosts']);
    },

    onError: (err) => {
      toast.error(err.message || 'Error uploading image');
    }
  })


  function handleImageUploaded() {
    const formData = new FormData();

    if (imageUpload.current.value == '') {
      throw new Error('Cannot Upload Empty Photo');
    }
    if (imageUpload.current.value != '') {
      formData.append('photo', imageUpload.current.files[0]);
    }

    return axios.put('https://linked-posts.routemisr.com/users/upload-photo', formData, {
      headers: {
        token: token
      }
    })
  }


  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <RiseLoader color="#0f4ff1" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen flex flex-col gap-5 justify-center items-center'>
        <h1 className='text-5xl font-bold text-red-600'>Error Can't get data</h1>
        <h2 className='text-5xl font-bold text-red-600'>Please Try Again</h2>
      </div>
    )
  }

  if (data.data.posts.length == 0) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen w-full">
          <h1 className='text-gray-700 font-bold text-4xl'>No Posts yet</h1>
        </div>
      </>
    )
  }

  const myPosts = [...data.data.posts];
  myPosts?.reverse();



  return (
    <>
      {isUploadImagePending && <div className='fixed top-20 left-1/2'>
        <RiseLoader color="#0f4ff1" />
      </div>}


      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 mx-10">
        
        <div className="w-full bg-gray-600 py-10 md:py-14 lg:py-20 mb-10 md:mb-16 lg:mb-20 flex flex-col md:flex-row items-center md:items-end gap-6 px-4 md:px-8 lg:px-16">
          <label htmlFor="uploadProfilePhoto">
            <div className="bg-white w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full relative cursor-pointer shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={data.data.posts?.[0].user.photo}
                  className="w-full h-full object-cover"
                  alt="User Photo"
                />
              </div>
              <div className="absolute w-8 h-8 md:w-10 md:h-10 right-1 bottom-1 flex items-center justify-center rounded-full bg-green-300 text-xl md:text-2xl font-bold shadow">
                +
              </div>
            </div>
          </label>
          <input
            ref={imageUpload}
            onChange={mutateHandleImageUploaded}
            type="file"
            id="uploadProfilePhoto"
            hidden
          />
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {data.data.posts?.[0].user.name}
          </h1>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl flex flex-col gap-4">
          {myPosts.map((post) => (
            <PostCard key={post._id} postDetails={post} postUser={post.user} />
          ))}


        </div>
      </div>
    </>
  )
}
