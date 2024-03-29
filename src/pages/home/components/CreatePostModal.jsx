import React, { useRef, useState } from 'react';

import '../home.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropType from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import DisplayError from '../../../components/DisplayError';
import { useCreatePostMutation } from '../../../store/postsApi';

const CreatePostModal = ({ showModal, setShowModal }) => {
  const [error, setError] = useState({});
  const [postData, setPostData] = useState({});
  const [createPost, { isError, isLoading }] = useCreatePostMutation();

  const fileRef = useRef(null);

  const handleFormSubmit = async () => {
    const obj = {};
    !postData.title && (obj.title = 'Please enter title');
    !postData.description && (obj.description = 'Please enter description');
    !postData.isPrivate && (obj.type = 'Please select post type');
    !postData.image && (obj.image = 'Please select image');
    setError(obj);
    if (Object.keys(postData).length === 4) {
      // getBase64(image).then((res) => {
      //   post.image = res;
      // });
      try {
        const response = await createPost(postData);
        // dispatch(
        //   postsApi.util.updateQueryData(
        //     'getFeedPosts',

        //     (cachedData) => {
        //       return {
        //         ...cachedData,
        //         data: [...cachedData.data, response.data.data],
        //       };
        //     }
        //   )
        // );
        isLoading && <span className="loader"></span>;
        setShowModal(null);
        setPostData({});
        if (isError) {
          obj.image = 'Something went wrong, please try again!';
          setError(obj);
        } else if (!response?.data) {
          obj.image = 'Something went wrong please try again!';
          setError(obj);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // async function getBase64(image) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(image);
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = reject;
  //   });
  // }

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(null);
        }}
        size="lg"
      >
        <form>
          <div className="border-bottom p-3 h3 d-flex justify-content-between align-items-center">
            Create Post
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => {
                setError({});
                setShowModal(false);
              }}
            />
          </div>
          <div className="px-3">
            <div className="d-flex align-items-center py-2">
              <label className="mr-2 w-25">
                Title: <span className="star">*</span> :
              </label>
              <div className="w-100">
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  onChange={(e) =>
                    setPostData({ ...postData, title: e.target.value })
                  }
                  placeholder="Enter Title"
                />
                <DisplayError error={error.title} />
              </div>
            </div>

            <div className="d-flex align-items-center py-2">
              <label className="mr-2 w-25">
                Description <span className="star">*</span> :
              </label>
              <div className="w-100">
                <textarea
                  name="description"
                  className="form-control"
                  onChange={(e) =>
                    setPostData({ ...postData, description: e.target.value })
                  }
                  placeholder="Enter Description"
                  rows="3"
                ></textarea>
                {error.description && (
                  <DisplayError error={error.description} />
                )}
              </div>
            </div>

            <div className="d-flex  align-items-center py-2">
              <label className="mr-2 w-25">
                Post Type <span className="star">*</span> :
              </label>
              <div className="w-100">
                <div
                  className="d-flex align-items-center h-100"
                  onChange={(e) =>
                    setPostData({ ...postData, isPrivate: e.target.value })
                  }
                >
                  <input
                    className="mr-2"
                    type="radio"
                    value="true"
                    id="private"
                    name="accType"
                    defaultChecked={postData.isPrivate === 'true'}
                  />
                  <label className="mb-0" htmlFor="private">
                    Private
                  </label>
                  <input
                    className="mx-2"
                    type="radio"
                    value="false"
                    id="public"
                    name="accType"
                    defaultChecked={postData.isPrivate === 'false'}
                  />
                  <label className="mb-0" htmlFor="public">
                    Public
                  </label>
                </div>
                <DisplayError error={error.type} />
              </div>
            </div>
            <div className="d-flex align-items-center py-2">
              <label htmlFor="image" className="mr-2 w-25">
                Photo <span className="star">*</span>:
              </label>
              <div className="w-100">
                <div className="d-flex align-items-center">
                  <input
                    ref={fileRef}
                    onChange={(e) =>
                      setPostData({ ...postData, image: e.target.files[0] })
                    }
                    type="file"
                    name="image"
                    className="form-control border-0 pl-0 w-75"
                  />

                  <button
                    onClick={(e) => {
                      setPostData({ ...postData, image: null });
                      fileRef.current.value = '';
                    }}
                    type="button"
                    className="btn btn-primary w-25"
                    disabled={!postData.image}
                  >
                    Remove Image
                  </button>
                </div>
                {error.image && <DisplayError error={error.image} />}
              </div>
            </div>
          </div>
          <Modal.Footer>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setError({});
                setShowModal(false);
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleFormSubmit} type="button">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CreatePostModal;
CreatePostModal.propTypes = {
  showModal: PropType.bool,
  setShowModal: PropType.any,
};
