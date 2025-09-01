import { FaUpload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { tokenContextObj } from "../../Context/TokenContextProvider";
import { ClipLoader } from "react-spinners";

export default function CreatePost() {

  const { token } = useContext(tokenContextObj);

  const [isImagePreviewed, setIsImagePreviewed] = useState(false)
  const [isCreatePost, setIsCreatePost] = useState(false)
  const [image, setImage] = useState(null)

  const imageUpload = useRef(null);
  const textTitle = useRef(null);


  const { isPending: isCreatePostPending, mutate: mutateCreatePost } = useMutation({
    mutationFn: handlePost,
    onSuccess: () => {
      toast.success('Post Created');
      handleDiscard();
    },
    onError: (error) => {
      toast.error(error.message ||'Cannot Create Post');
    }
  })


  function handleImagePreview() {
    const file = imageUpload.current.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setIsImagePreviewed(true);
    setImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }

  function handleDiscard() {
    setIsImagePreviewed(false);
    setImage(null);
    imageUpload.current.value = '';
    textTitle.current.value = '';
    setIsCreatePost(false);
  }



  function handlePost() {
    const formData = new FormData();

    if (textTitle.current.value == '' && imageUpload.current.value == '') {
      throw new Error('Cannot Create Empty Post');
    }
    if (textTitle.current.value != '') {
      formData.append('body', textTitle.current.value);
    }
    if (imageUpload.current.value != '') {
      formData.append('image', imageUpload.current.files[0]);
    }

    return axios.post('https://linked-posts.routemisr.com/posts', formData, {
      headers: {
        token: token
      }
    })
  }



  return (
    <>
      {!isCreatePost && <input type="text" onClick={() => setIsCreatePost(true)} className="w-full rounded-full border text-black font-bold p-5" placeholder="What's on your mind?" />}

      {isCreatePost && <div className="my-3 bg-white p-5 rounded-2xl">

        <div onClick={() => setIsCreatePost(false)} className="flex justify-end mb-3 text-lg cursor-pointer">
          <IoMdClose />
        </div>

        <input type="text" ref={textTitle} autoFocus className="w-full rounded-full border text-black font-bold p-5" placeholder="What's on your mind?" />

        {image && isImagePreviewed && <div className="py-3">
          <div onClick={() => {
            setIsImagePreviewed(false);
            setImage(null);
            imageUpload.current.value = '';
          }}
            className="flex justify-end mb-3 text-lg cursor-pointer">
            <IoMdClose />
          </div>
          <img src={image} className="w-full" alt="" />
        </div>}


        <div className="m-3 my-5">
          <label htmlFor="imageInput" className="cursor-pointer bg-gray-400 p-3 rounded-full"><FaUpload className="inline" /> Upload Image</label>
          <input ref={imageUpload} onChange={handleImagePreview} type="file" id="imageInput" hidden />
        </div>

        <div className="flex justify-end gap-3">
          <button disabled = {isCreatePostPending} onClick={mutateCreatePost} className="py-2 px-5 bg-blue-500 text-white rounded-full hover:bg-blue-700" >{isCreatePostPending ? <ClipLoader /> : 'Post'}</button>
          <button disabled = {isCreatePostPending} onClick={handleDiscard} className="py-2 px-5 bg-red-500 text-white rounded-full hover:bg-red-700">Discard</button>
        </div>

      </div>}


    </>
  )
}
