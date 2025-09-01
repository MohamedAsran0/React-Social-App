
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useContext, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { tokenContextObj } from "../../Context/TokenContextProvider";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function UpdatePostModal({ openModal, setOpenModal, post }) {

  const { token } = useContext(tokenContextObj);

  const [isImagePreviewed, setIsImagePreviewed] = useState(post.image != undefined ? true : false);
  const [image, setImage] = useState(post.image != undefined ? post.image : null);
  const [textTyped, setTextTyped] = useState(post.body != undefined ? post.body : '')

  const imageUpload = useRef(null);

  const qClient = useQueryClient();

  const { isPending: isUpdatePostPending, mutate: mutateHandleUpdatePost } = useMutation({
    mutationFn: handleUpdatePost,

    onSuccess: () => {
      toast.success('Post updated successfully');
      qClient.invalidateQueries(['getUserPosts']);
      setOpenModal(false);
    },

    onError: (err) => {
      toast.error(err.message || 'Cannot update post');
    }
  })


  function handleDismiss() {
    setOpenModal(false);
    setImage(post.image != undefined ? post.image : null);
    setIsImagePreviewed(post.image != undefined ? true : false);
    setTextTyped(post.body != undefined ? post.body : '');
  }


  function handleImagePreview() {
    const file = imageUpload.current.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setIsImagePreviewed(true);
    setImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }

  function handleUpdatePost() {
    const formData = new FormData();

    if (textTyped == '' && imageUpload.current.value == '') {
      throw new Error('Cannot Create Empty Post');
    }
    if (textTyped != '') {
      formData.append('body', textTyped);
    }
    if (imageUpload.current.value != '') {
      formData.append('image', imageUpload.current.files[0]);
    }

    return axios.put(`https://linked-posts.routemisr.com/posts/${post._id}`, formData, {
      headers: {
        token: token
      }
    })
  }

  return (
    <>
      <Modal show={openModal} onClose={() => {
        setOpenModal(false);
        setImage(post.image != undefined ? post.image : null);
        setIsImagePreviewed(post.image != undefined ? true : false);
        setTextTyped(post.body != undefined ? post.body : '')
      }}>
        <ModalHeader>Update Post</ModalHeader>
        <ModalBody>
          <div className="space-y-6">


            <input type="text" value={textTyped} onChange={(e) => setTextTyped(e.target.value)} autoFocus className="w-full rounded-full border text-black font-bold p-5" placeholder="What's on your mind?" />

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


          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end gap-3">
            <button disabled={isUpdatePostPending} onClick={mutateHandleUpdatePost} className="py-2 px-5 bg-blue-500 text-white rounded-full hover:bg-blue-700" >{isUpdatePostPending ? <ClipLoader /> : 'Update'}</button>
            <button disabled={isUpdatePostPending} onClick={handleDismiss} className="py-2 px-5 bg-red-500 text-white rounded-full hover:bg-red-700">Dismiss</button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
