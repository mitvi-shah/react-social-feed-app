import React, { useRef, useState } from 'react';

import '../home.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import PropType from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Loader from '../../../components/Loader';
import { useCreatePostMutation } from '../../../store/postsApi';
import { postSchema } from '../../../utils/validationSchemas';

const CreatePostModal = ({ showModal, setShowModal }) => {
  const [createPost, { isError, isLoading }] = useCreatePostMutation();
  const [apiErrors, setApiErrors] = useState('');
  const schema = yup.object().shape(postSchema);
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const fileRef = useRef(null);

  const addPost = async (data) => {
    // getBase64(image).then((res) => {
    //   post.image = res;
    // });
    try {
      const response = await createPost(data);

      isLoading && <Loader />;
      setShowModal(null);
      if (isError) {
        setApiErrors(response.error.data.message);
      } else if (!response?.data) {
        setApiErrors(response.error.data.message);
      }
    } catch (error) {
      setApiErrors(error);
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
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(null);
      }}
      size="lg"
    >
      <form type="submit" onSubmit={handleSubmit(addPost)}>
        <div className="border-bottom p-3 h3 d-flex justify-content-between align-items-center">
          Create Post
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => {
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
                className="form-control"
                type="text"
                id="title"
                name="title"
                placeholder="Enter title"
                {...register('title')}
              />
              {errors.title && (
                <span className="error"> {errors.title?.message}</span>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center py-2">
            <label className="mr-2 w-25">
              Description <span className="star">*</span> :
            </label>
            <div className="w-100">
              <textarea
                name="description"
                id="description"
                className="form-control"
                {...register('description')}
                placeholder="Enter Description"
                rows="3"
              ></textarea>
              {errors.description && (
                <span className="error"> {errors.description?.message}</span>
              )}
            </div>
          </div>

          <div className="d-flex  align-items-center py-2">
            <label className="mr-2 w-25">
              Post Type <span className="star">*</span> :
            </label>
            <div className="w-100">
              <div className="d-flex align-items-center h-100">
                <input
                  className="mr-2"
                  type="radio"
                  value="true"
                  name="isPrivate"
                  id="private"
                  {...register('isPrivate')}
                />
                <label className="mb-0" htmlFor="private">
                  Private
                </label>
                <input
                  className="mx-2"
                  type="radio"
                  value="false"
                  name="isPrivate"
                  id="public"
                  {...register('isPrivate')}
                />
                <label className="mb-0" htmlFor="public">
                  Public
                </label>
              </div>
              {errors.isPrivate && (
                <span className="error">{errors.isPrivate?.message}</span>
              )}
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
                  {...register('image')}
                  type="file"
                  name="image"
                  className="form-control border-0 pl-0 w-75"
                />

                <button
                  onClick={(e) => {
                    unregister('image');
                    fileRef.current.value = '';
                  }}
                  type="button"
                  className="btn btn-primary w-25"
                  disabled={!watch('image')}
                >
                  Remove Image
                </button>
              </div>
              {errors.image && (
                <span className="error">{errors.image?.message}</span>
              )}
              {apiErrors && <div className="error">{apiErrors}</div>}
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
CreatePostModal.propTypes = {
  showModal: PropType.bool,
  setShowModal: PropType.any,
};
