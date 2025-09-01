"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import PostCard from "../PostCard/PostCard";
import CardHeader from "../CardHeader/CardHeader";

export default function ModalPostDetails( {openModal, setOpenModal, postDetails, postUser} ) {


  const comments = [...postDetails.comments];
  comments?.reverse();
  


  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader></ModalHeader>
        <ModalBody>

          <PostCard postDetails = {postDetails} postUser = {postUser} isPostWithComments/>

          {comments &&  <div className="flex flex-col gap-y-3 mt-3">
           { comments?.map((comment => {
            return <div key={comment._id} className="p-6 bg-gray-300 rounded-2xl">
              <CardHeader postDetails={comment} cardUser={comment.commentCreator} isComment/>
            </div>
          }))}
          </div>}
          
        </ModalBody>
      </Modal>
    </>
  );
}
