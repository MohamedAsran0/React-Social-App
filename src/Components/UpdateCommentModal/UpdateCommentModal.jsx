import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useContext, useState } from "react";
import { tokenContextObj } from "../../Context/TokenContextProvider";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function UpdateCommentModal({ openModal, setOpenModal, post }) {

  const { token } = useContext(tokenContextObj);

  const [textTyped, setTextTyped] = useState(post.content != undefined ? post.content : '')

  const qClient = useQueryClient();

  const { isPending: isUpdateCommentPending, mutate: mutateHandleUpdateComment } = useMutation({
    mutationFn: handleUpdateComment,

    onSuccess: () => {
      toast.success('Comment updated successfully');
      qClient.invalidateQueries(['getUserPosts']);
      setOpenModal(false);
    },

    onError: (err) => {
      toast.error(err.message || 'Cannot update Comment');
    }
  })


  function handleDismiss() {
    setOpenModal(false);
    setTextTyped(post.content != undefined ? post.content : '');
  }


  function handleUpdateComment() {

    if (textTyped == '') {
      throw new Error('Cannot Create Empty Comment');
    }

    return axios.put(`https://linked-posts.routemisr.com/comments/${post._id}`, {content : textTyped}, {
      headers: {
        token: token
      }
    })
  }

  return (
    <>
      <Modal show={openModal} onClose={() => {
        setOpenModal(false);
        setTextTyped(post.content != undefined ? post.content : '')
      }}>
        <ModalHeader>Update Post</ModalHeader>
        <ModalBody>
          <div className="space-y-6">


            <input type="text" value={textTyped} onChange={(e) => setTextTyped(e.target.value)} autoFocus className="w-full rounded-full border text-black font-bold p-5" placeholder="Write Your Comment..." />


          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end gap-3">
            <button disabled={isUpdateCommentPending} onClick={mutateHandleUpdateComment} className="py-2 px-5 bg-blue-500 text-white rounded-full hover:bg-blue-700" >{isUpdateCommentPending ? <ClipLoader /> : 'Update'}</button>
            <button disabled={isUpdateCommentPending} onClick={handleDismiss} className="py-2 px-5 bg-red-500 text-white rounded-full hover:bg-red-700">Dismiss</button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
