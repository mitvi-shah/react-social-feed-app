import { useMemo, useState } from 'react';

import PropType from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import img from '../../../assets/images/img.jpg';
import { useGetFeedPostsQuery } from '../../../store/postsApi';
import TimeAgo from '../../../utils/TimeAgo';

import '../home.css';
const FeedPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);

  const { posts, disableNext, isLoading } = useGetFeedPostsQuery(
    useMemo(() => {
      console.log('first');
      const arg = { page: 1 };
      if (searchParams.get('title')) {
        arg.search = searchParams.get('title');
      }
      if (searchParams.get('isMyPostsOnly')) {
        arg.isMyPostsOnly = searchParams.get('isMyPostsOnly');
      }
      setPage(1);
      return arg;
    }, [searchParams]),
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isLoading }) => ({
        disableNext: data?.total / 5 < page || data?.total / 5 === page,
        isLoading: isLoading,
        posts: data?.data,
      }),
    }
  );
  const setPageParams = (currentPage) => {
    if (searchParams.get('page') !== currentPage) {
      setSearchParams({ page: currentPage });
      setPage(currentPage);
    }
  };

  const cards = posts?.map((post) => {
    return (
      <div className="card post-card my-3" key={post._id}>
        <h3 className="card-header">{post.title}</h3>
        <div className="px-3">
          <div className="description pt-2">{post.description}</div>
          Created At : <TimeAgo timestamp={new Date(post.createdAt)} />
          <img className="pt-2" src={img} alt="user" height={300} width={920} />
        </div>
      </div>
    );
  });

  return (
    <div className="position-relative">
      {cards}
      <div className="pagination-container">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPageParams(page - 1)}
            disabled={page === 1}
          >
            <span aria-hidden="true">«</span>
          </Pagination.Prev>
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next
            disabled={disableNext}
            onClick={() => setPageParams(page + 1)}
          >
            <span aria-hidden="true">»</span>
          </Pagination.Next>
        </Pagination>
      </div>
      {!isLoading && !posts?.length && <h1>No Posts Found</h1>}
    </div>
  );
};

export default FeedPosts;
FeedPosts.propTypes = {
  title: PropType.string,
};
