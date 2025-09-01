import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { tokenContextObj } from '../../Context/TokenContextProvider'
import { RiseLoader } from 'react-spinners'
import PostCard from '../PostCard/PostCard'
import { jwtDecode } from "jwt-decode";


export default function Profile() {

  const { token } = useContext(tokenContextObj);

  const decoded = jwtDecode(token);


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



  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 mx-10">
        <div className='h-70 w-full bg-gray-600 pt-12 mb-35'>
          <div className='bg-white w-fit rounded-full ml-5 relative cursor-pointer'>
            <div className='w-full rounded-full overflow-hidden'>
              <img src={data.data.posts?.[0].user.photo} className='w-full' alt="User Photo" />
            </div>
            <div className='absolute w-14 h-14 right-3 bottom-3 p-3 rounded-full bg-green-300 text-2xl font-semibold text-center'>+</div>
          </div>
          <h1 className='text-4xl p-7 pl-32 font-bold'>{data.data.posts?.[0].user.name}</h1>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl flex flex-col gap-4">
          {data.data.posts.map((post) => (
            <PostCard key={post._id} postDetails={post} postUser={post.user} />
          ))}


        </div>
      </div>
    </>
  )
}
