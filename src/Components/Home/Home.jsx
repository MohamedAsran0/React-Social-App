import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { tokenContextObj } from '../../Context/TokenContextProvider'
import { RiseLoader } from 'react-spinners'
import PostCard from '../PostCard/PostCard'
import CreatePost from './../CreatePost/CreatePost';

export default function Home() {

  const { token } = useContext(tokenContextObj);

  function getAllPosts() {
    return axios.get('https://linked-posts.routemisr.com/posts?limit=20', {
      headers: {
        token: token
      }
    });
  }


  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllPosts'],
    queryFn: getAllPosts,
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



  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 mx-10">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl flex flex-col gap-4">

          <CreatePost />

          {data.data.posts.map((post) => (
            <PostCard key={post._id} postDetails={post} postUser={post.user} />
          ))}


        </div>
      </div>
    </>
  )
}
