import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ length, postsPerPage, handlePagination, currentPage }) => {
  const totalPages = Math.ceil(length / postsPerPage);
  const paginationNumbers = [];
  const maxLinks = 10; // Number of page links to show at a time

  if (totalPages <= 1) {
    return null;
  }

  let startPage = Math.max(1, currentPage - Math.floor(maxLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxLinks - 1);

  if (endPage - startPage + 1 < maxLinks) {
    startPage = Math.max(1, endPage - maxLinks + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationNumbers.push(i);
  }

  return (
    <div className="pagination flex justify-center mt-4">
      {/* "First" button */}
      <button
        onClick={() => handlePagination(1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
      >
        &laquo; First
      </button>

      {/* "Prev" button */}
      <button
        onClick={() => handlePagination(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Prev
      </button>

      {/* Ellipsis before page numbers */}
      {startPage > 1 && <span className="mx-1 px-3 py-1">...</span>}

      {/* Page number buttons */}
      {paginationNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePagination(pageNumber)}
          className={`mx-1 px-3 py-1 border rounded-md ${
            pageNumber === currentPage ? 'bg-indigo-600 text-white' : ''
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Ellipsis after page numbers */}
      {endPage < totalPages && <span className="mx-1 px-3 py-1">...</span>}

      {/* "Next" button */}
      <button
        onClick={() => handlePagination(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>

      {/* "Last" button */}
      <button
        onClick={() => handlePagination(totalPages)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Last &raquo;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  length: PropTypes.number.isRequired,
  postsPerPage: PropTypes.number.isRequired,
  handlePagination: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;