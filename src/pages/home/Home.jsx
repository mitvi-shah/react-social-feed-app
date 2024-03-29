import React, { useEffect, useState } from 'react';

import './home.css';

import { useSearchParams } from 'react-router-dom';

import CreatePostModal from './components/CreatePostModal';
import FeedPosts from './components/FeedPosts';
import useDebounce from '../../hooks/debounce';

const Home = () => {
  const [showModal, setShowModal] = useState(null);
  const [query, setQuery] = useState('');

  const [params, setParams] = useSearchParams();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setSearchParams();
  }, [debouncedQuery]);

  const setSearchParams = () => {
    const newParams = new URLSearchParams(params);
    debouncedQuery.trim() !== ''
      ? newParams.set('title', debouncedQuery)
      : newParams.delete('title');
    setParams(newParams.toString());
  };

  const setMyPostFilterParams = (checked) => {
    const newParams = new URLSearchParams(params);
    checked
      ? newParams.set('isMyPostsOnly', true)
      : newParams.delete('isMyPostsOnly');
    setParams(newParams.toString());
  };
  return (
    <>
      <div className="d-flex">
        <div className="w-100 d-flex justify-content-center ">
          <div className="w-50 d-flex">
            <input
              type="text"
              placeholder="Search Posts..."
              className="form-control  my-3"
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* <button className="btn text-primary">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button> */}
          </div>
        </div>
        <div className="myPostSwitch btn btn-outline-secondary">
          <label className="d-inline">
            <input
              className="mr-2"
              type="checkbox"
              onChange={(e) => setMyPostFilterParams(e.target.checked)}
            />
            My Post Only
          </label>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-outline-primary create-post"
        >
          Create Post
        </button>
      </div>

      <CreatePostModal showModal={showModal} setShowModal={setShowModal} />
      <div className="d-flex justify-content-center align-items-center ">
        <div className="w-50 h-100">
          <FeedPosts />
        </div>
      </div>
    </>
  );
};

export default Home;
